const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files
app.use(express.static(__dirname));

// Store all connected students and teachers
const students = new Map(); // studentID -> { ws, data }
const teachers = new Set(); // Set of teacher WebSocket connections

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('New connection established');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            // Handle different message types
            switch(data.type) {
                case 'register_student':
                    handleStudentRegistration(ws, data);
                    break;
                    
                case 'register_teacher':
                    handleTeacherRegistration(ws);
                    break;
                    
                case 'student_update':
                    handleStudentUpdate(data);
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
        // Remove disconnected student or teacher
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
            name: data.name,
            class: data.class,
            email: data.email,
            status: 'connected',
            currentPhase: 'diagnostic',
            currentQuestion: 0,
            level: 'basic',
            score: 0,
            screenCapture: null,
            connectedAt: new Date().toISOString(),
            lastUpdate: new Date().toISOString()
        }
    });
    
    console.log(`Student registered: ${data.name} (${studentID})`);
    
    // Notify all teachers about new student
    broadcastToTeachers({
        type: 'new_student',
        student: students.get(studentID).data
    });
}

function handleTeacherRegistration(ws) {
    teachers.add(ws);
    console.log('Teacher connected. Total teachers:', teachers.size);
    
    // Send current student list to newly connected teacher
    sendAllStudentsToTeacher(ws);
}

function handleStudentUpdate(data) {
    const studentID = data.studentID;
    if (students.has(studentID)) {
        const student = students.get(studentID);
        
        // Update student data
        student.data = {
            ...student.data,
            ...data.update,
            lastUpdate: new Date().toISOString()
        };
        
        // Broadcast update to all teachers
        broadcastToTeachers({
            type: 'student_update',
            studentID: studentID,
            update: student.data
        });
    }
}

function handleScreenCapture(data) {
    const studentID = data.studentID;
    if (students.has(studentID)) {
        const student = students.get(studentID);
        student.data.screenCapture = data.imageData;
        
        // Send screen capture to teachers
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

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        students: students.size,
        teachers: teachers.size,
        timestamp: new Date().toISOString()
    });
});

// API endpoint to get all students (for debugging)
app.get('/api/students', (req, res) => {
    const allStudents = {};
    for (let [studentID, student] of students.entries()) {
        allStudents[studentID] = student.data;
    }
    res.json(allStudents);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║   ADAPTIVE LEARNING SERVER RUNNING            ║
║                                               ║
║   Server: http://localhost:${PORT}              ║
║   Student: http://localhost:${PORT}/student.html║
║   Teacher: http://localhost:${PORT}/teacher.html║
║                                               ║
║   Status: READY ✓                             ║
╚═══════════════════════════════════════════════╝
    `);
});
