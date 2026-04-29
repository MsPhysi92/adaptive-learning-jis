const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(express.static(__dirname));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Load PDF generator
const { generatePDFReport } = require('./pdf-generator.js');

// Configure file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Store all connected students and teachers
const students = new Map(); // studentID -> { ws, data }
const teachers = new Set(); // Set of teacher WebSocket connections
const materials = []; // Store uploaded materials

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('New connection established');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            switch(data.type) {
                case 'student_registered':
                case 'register_student':
                    handleStudentRegistration(ws, data);
                    break;
                    
                case 'register_teacher':
                    handleTeacherRegistration(ws);
                    break;
                    
                case 'student_update':
                    handleStudentUpdate(data);
                    break;
                    
                case 'student_complete':
                    handleStudentComplete(data);
                    break;
                    
                case 'screen_capture':
                    handleScreenCapture(data);
                    break;
                    
                case 'request_all_students':
                    sendAllStudentsToTeacher(ws);
                    break;
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    ws.on('close', () => {
        for (let [studentID, student] of students.entries()) {
            if (student.ws === ws) {
                students.delete(studentID);
                broadcastToTeachers({
                    type: 'student_disconnected',
                    studentID: studentID
                });
                console.log(`Student ${studentID} disconnected`);
                break;
            }
        }
        teachers.delete(ws);
    });
});

function handleStudentRegistration(ws, data) {
    const studentID = data.studentID;
    students.set(studentID, {
        ws: ws,
        data: {
            studentID: data.studentID,
            name: data.name || 'Unknown',
            class: data.class || 'N/A',
            status: 'Active',
            currentPhase: 'registration',
            diagnosticScore: 0,
            level: 'foundation',
            levelQuizScore: 0,
            comprehensionScore: 0,
            connectedAt: new Date().toISOString(),
            lastUpdate: new Date().toISOString()
        }
    });
    
    console.log(`Student registered: ${data.name} (${studentID})`);
    
    broadcastToTeachers({
        type: 'new_student',
        student: students.get(studentID).data
    });
}

function handleTeacherRegistration(ws) {
    teachers.add(ws);
    console.log('Teacher connected. Total teachers:', teachers.size);
    sendAllStudentsToTeacher(ws);
}

function handleStudentUpdate(data) {
    const studentID = data.studentID;
    if (students.has(studentID)) {
        const student = students.get(studentID);
        
        student.data = {
            ...student.data,
            ...data.update,
            lastUpdate: new Date().toISOString()
        };
        
        broadcastToTeachers({
            type: 'student_update',
            studentID: studentID,
            update: student.data
        });
        
        // Save to file
        saveStudentData(studentID, student.data);
    }
}

function handleStudentComplete(data) {
    const studentID = data.studentID;
    if (students.has(studentID)) {
        const student = students.get(studentID);
        
        student.data = {
            ...student.data,
            ...data.finalData,
            status: 'Completed',
            lastUpdate: new Date().toISOString()
        };
        
        broadcastToTeachers({
            type: 'student_complete',
            studentID: studentID,
            data: student.data
        });
        
        // Save final data
        saveStudentData(studentID, student.data);
    }
}

function handleScreenCapture(data) {
    const studentID = data.studentID;
    if (students.has(studentID)) {
        const student = students.get(studentID);
        student.data.screenCapture = data.imageData;
        
        broadcastToTeachers({
            type: 'screen_update',
            studentID: studentID,
            imageData: data.imageData
        });
    }
}

function sendAllStudentsToTeacher(ws) {
    const allStudents = {};
    for (let [studentID, student] of students.entries()) {
        allStudents[studentID] = student.data;
    }
    
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: 'all_students',
            students: allStudents
        }));
    }
}

function broadcastToTeachers(message) {
    const messageStr = JSON.stringify(message);
    teachers.forEach(teacher => {
        if (teacher.readyState === WebSocket.OPEN) {
            teacher.send(messageStr);
        }
    });
}

function saveStudentData(studentID, data) {
    try {
        const filePath = path.join(dataDir, `${studentID}.json`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error saving student data:', error);
    }
}

// API: Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        students: students.size,
        teachers: teachers.size,
        timestamp: new Date().toISOString()
    });
});

// API: Get all students
app.get('/api/students', (req, res) => {
    const allStudents = {};
    for (let [studentID, student] of students.entries()) {
        allStudents[studentID] = student.data;
    }
    res.json(allStudents);
});

// API: Get single student
app.get('/api/students/:id', (req, res) => {
    const studentID = req.params.id;
    if (students.has(studentID)) {
        res.json(students.get(studentID).data);
    } else {
        // Try to load from file
        try {
            const filePath = path.join(dataDir, `${studentID}.json`);
            if (fs.existsSync(filePath)) {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                res.json(data);
            } else {
                res.status(404).json({ error: 'Student not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error loading student data' });
        }
    }
});

// API: Generate PDF report
app.get('/api/pdf/:studentID', (req, res) => {
    try {
        const studentID = req.params.studentID;
        let studentData = null;
        
        if (students.has(studentID)) {
            studentData = students.get(studentID).data;
        } else {
            const filePath = path.join(dataDir, `${studentID}.json`);
            if (fs.existsSync(filePath)) {
                studentData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            }
        }
        
        if (!studentData) {
            return res.status(404).send('Student not found');
        }
        
        const pdfHTML = generatePDFReport(studentData);
        res.send(pdfHTML);
    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).send('Failed to generate PDF');
    }
});

// API: Export student data as CSV
app.get('/api/csv/:studentID', (req, res) => {
    try {
        const studentID = req.params.studentID;
        let studentData = null;
        
        if (students.has(studentID)) {
            studentData = students.get(studentID).data;
        } else {
            const filePath = path.join(dataDir, `${studentID}.json`);
            if (fs.existsSync(filePath)) {
                studentData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            }
        }
        
        if (!studentData) {
            return res.status(404).send('Student not found');
        }
        
        const csv = generateCSV(studentData);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${studentID}_report.csv"`);
        res.send(csv);
    } catch (error) {
        console.error('CSV generation error:', error);
        res.status(500).send('Failed to generate CSV');
    }
});

// API: Export all students as CSV
app.get('/api/csv-all', (req, res) => {
    try {
        let csv = 'Student ID,Name,Class,Diagnostic Score,Level,Level Quiz Score,Comprehension Score,Status,Last Update\n';
        
        for (let [studentID, student] of students.entries()) {
            const d = student.data;
            csv += `${d.studentID || ''},${d.name || ''},${d.class || ''},${d.diagnosticScore || 0},${d.level || ''},${d.levelQuizScore || ''},${d.comprehensionScore || ''},${d.status || ''},${d.lastUpdate || ''}\n`;
        }
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="all_students_report.csv"');
        res.send(csv);
    } catch (error) {
        console.error('CSV generation error:', error);
        res.status(500).send('Failed to generate CSV');
    }
});

function generateCSV(studentData) {
    let csv = 'Student Learning Report\n\n';
    csv += 'Field,Value\n';
    csv += `Student ID,${studentData.studentID || ''}\n`;
    csv += `Name,${studentData.name || ''}\n`;
    csv += `Class,${studentData.class || ''}\n`;
    csv += `Diagnostic Score,${studentData.diagnosticScore || 0}%\n`;
    csv += `Assigned Level,${studentData.level || ''}\n`;
    csv += `Level Quiz Score,${studentData.levelQuizScore || ''}%\n`;
    csv += `Comprehension Score,${studentData.comprehensionScore || ''}%\n`;
    csv += `Status,${studentData.status || ''}\n`;
    csv += `Last Update,${studentData.lastUpdate || ''}\n`;
    return csv;
}

// API: Upload material
app.post('/api/upload-material', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const material = {
            id: Date.now().toString(),
            filename: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            type: req.file.mimetype,
            title: req.body.title || req.file.originalname,
            description: req.body.description || '',
            uploadedAt: new Date().toISOString()
        };
        
        materials.push(material);
        saveMaterials();
        
        res.json({ success: true, material: material });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// API: Get materials
app.get('/api/materials', (req, res) => {
    loadMaterials();
    res.json(materials);
});

// API: Delete material
app.delete('/api/materials/:id', (req, res) => {
    try {
        const id = req.params.id;
        const index = materials.findIndex(m => m.id === id);
        
        if (index !== -1) {
            const material = materials[index];
            if (fs.existsSync(material.path)) {
                fs.unlinkSync(material.path);
            }
            materials.splice(index, 1);
            saveMaterials();
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Material not found' });
        }
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Delete failed' });
    }
});

// API: Download material
app.get('/api/download/:id', (req, res) => {
    const id = req.params.id;
    const material = materials.find(m => m.id === id);
    
    if (material && fs.existsSync(material.path)) {
        res.download(material.path, material.filename);
    } else {
        res.status(404).send('File not found');
    }
});

function saveMaterials() {
    try {
        const filePath = path.join(dataDir, 'materials.json');
        fs.writeFileSync(filePath, JSON.stringify(materials, null, 2));
    } catch (error) {
        console.error('Error saving materials:', error);
    }
}

function loadMaterials() {
    try {
        const filePath = path.join(dataDir, 'materials.json');
        if (fs.existsSync(filePath)) {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            materials.length = 0;
            materials.push(...data);
        }
    } catch (error) {
        console.error('Error loading materials:', error);
    }
}

// Load materials on startup
loadMaterials();

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║   ADAPTIVE LEARNING SERVER RUNNING            ║
║                                               ║
║   Port: ${PORT}                                  ║
║   Environment: ${process.env.NODE_ENV || 'development'}       ║
║                                               ║
║   Endpoints:                                  ║
║   - /student.html (Student Interface)         ║
║   - /teacher.html (Teacher Dashboard)         ║
║   - /admin.html (Admin Panel)                 ║
║                                               ║
║   Features:                                   ║
║   ✓ Real-time monitoring                      ║
║   ✓ PDF Reports (Print-Ready)                 ║
║   ✓ CSV Export                                ║
║   ✓ Material Upload                           ║
║                                               ║
║   Status: READY ✓                             ║
╚═══════════════════════════════════════════════╝
    `);
});
