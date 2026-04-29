// pdf-generator.js - Professional PDF Report Generator
// This module generates print-ready PDF reports for student learning journeys

function generatePDFReport(studentData) {
    // Return HTML that will be used with jsPDF in the frontend
    // This template is designed for professional printing
    
    const template = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Student Report - ${studentData.name}</title>
    <style>
        @page {
            size: A4;
            margin: 20mm;
        }
        
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
        }
        
        .report-header {
            text-align: center;
            border-bottom: 4px solid #1a365d;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .report-header h1 {
            color: #1a365d;
            font-size: 28pt;
            margin: 0 0 10px 0;
        }
        
        .report-header .subtitle {
            color: #2c5282;
            font-size: 14pt;
            font-weight: 600;
        }
        
        .report-meta {
            background: #f7fafc;
            border-left: 4px solid #ed8936;
            padding: 15px;
            margin-bottom: 25px;
        }
        
        .report-meta table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .report-meta td {
            padding: 8px;
            font-size: 11pt;
        }
        
        .report-meta td:first-child {
            font-weight: 700;
            color: #1a365d;
            width: 35%;
        }
        
        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        
        .section-title {
            background: linear-gradient(135deg, #1a365d, #2c5282);
            color: white;
            padding: 12px 20px;
            font-size: 14pt;
            font-weight: 700;
            margin-bottom: 15px;
            border-radius: 4px;
        }
        
        .score-box {
            background: #e6fffa;
            border: 2px solid #38a169;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
        }
        
        .score-box .score {
            font-size: 48pt;
            font-weight: 700;
            color: #38a169;
            margin: 0;
        }
        
        .score-box .label {
            font-size: 12pt;
            color: #2c5282;
            font-weight: 600;
        }
        
        .pathway-timeline {
            margin: 20px 0;
        }
        
        .timeline-item {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            padding-left: 30px;
            position: relative;
        }
        
        .timeline-item:before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 16px;
            height: 16px;
            background: #ed8936;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 0 0 2px #ed8936;
        }
        
        .timeline-item .phase {
            font-weight: 700;
            color: #1a365d;
            margin-right: 10px;
        }
        
        .timeline-item .result {
            color: #666;
        }
        
        .achievement-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
        }
        
        .achievement {
            background: #fef5e7;
            border-left: 4px solid #d69e2e;
            padding: 15px;
            font-size: 10pt;
        }
        
        .achievement .title {
            font-weight: 700;
            color: #1a365d;
            margin-bottom: 5px;
        }
        
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            color: #718096;
            font-size: 9pt;
        }
        
        .signature-section {
            margin-top: 40px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
        }
        
        .signature-box {
            text-align: center;
        }
        
        .signature-line {
            border-top: 2px solid #333;
            margin-top: 50px;
            padding-top: 10px;
            font-weight: 600;
        }
        
        @media print {
            body { margin: 0; padding: 15mm; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="report-header">
        <h1>🎓 ADAPTIVE LEARNING REPORT</h1>
        <div class="subtitle">Characteristics of Light - Personalized Journey</div>
    </div>
    
    <div class="report-meta">
        <table>
            <tr>
                <td>Student Name:</td>
                <td><strong>${studentData.name || 'N/A'}</strong></td>
            </tr>
            <tr>
                <td>Student ID:</td>
                <td><strong>${studentData.studentID || 'N/A'}</strong></td>
            </tr>
            <tr>
                <td>Class:</td>
                <td><strong>${studentData.class || 'N/A'}</strong></td>
            </tr>
            <tr>
                <td>Report Date:</td>
                <td><strong>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></td>
            </tr>
            <tr>
                <td>Status:</td>
                <td><strong style="color: #38a169;">✓ ${studentData.status || 'Completed'}</strong></td>
            </tr>
        </table>
    </div>
    
    <div class="section">
        <div class="section-title">📊 DIAGNOSTIC ASSESSMENT</div>
        <div class="score-box">
            <div class="score">${studentData.diagnosticScore || 0}%</div>
            <div class="label">Initial Assessment Score</div>
        </div>
        <p><strong>Assigned Learning Path:</strong> ${getLevelName(studentData.level)}</p>
        <p>Based on diagnostic results, the student was placed on a personalized learning pathway tailored to their current understanding level.</p>
    </div>
    
    <div class="section">
        <div class="section-title">🎯 LEARNING PATHWAY</div>
        <div class="pathway-timeline">
            <div class="timeline-item">
                <span class="phase">Phase 1: Registration & Diagnostic</span>
                <span class="result">Score: ${studentData.diagnosticScore || 0}%</span>
            </div>
            <div class="timeline-item">
                <span class="phase">Phase 2: Level-Based Learning</span>
                <span class="result">Path: ${getLevelName(studentData.level)}</span>
            </div>
            <div class="timeline-item">
                <span class="phase">Phase 3: Comprehension Testing</span>
                <span class="result">10 Questions Completed</span>
            </div>
            <div class="timeline-item">
                <span class="phase">Phase 4: Core Instruction</span>
                <span class="result">Universal Concepts Mastered</span>
            </div>
            <div class="timeline-item">
                <span class="phase">Phase 5: Final Assessment</span>
                <span class="result">Score: ${studentData.comprehensionScore || 'N/A'}%</span>
            </div>
        </div>
    </div>
    
    <div class="section">
        <div class="section-title">🏆 ACHIEVEMENTS & PROGRESS</div>
        <div class="achievement-grid">
            <div class="achievement">
                <div class="title">✓ Diagnostic Completed</div>
                <div>Successfully completed initial 5-question assessment</div>
            </div>
            <div class="achievement">
                <div class="title">✓ Adaptive Learning</div>
                <div>Followed personalized ${getLevelName(studentData.level)} pathway</div>
            </div>
            <div class="achievement">
                <div class="title">✓ Comprehension Test</div>
                <div>Completed 10-question level verification</div>
            </div>
            <div class="achievement">
                <div class="title">✓ Core Mastery</div>
                <div>Mastered universal characteristics of light</div>
            </div>
        </div>
    </div>
    
    <div class="section">
        <div class="section-title">📈 PERFORMANCE SUMMARY</div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <thead>
                <tr style="background: #f7fafc; border-bottom: 2px solid #1a365d;">
                    <th style="padding: 12px; text-align: left; color: #1a365d;">Assessment Phase</th>
                    <th style="padding: 12px; text-align: center; color: #1a365d;">Questions</th>
                    <th style="padding: 12px; text-align: center; color: #1a365d;">Score</th>
                </tr>
            </thead>
            <tbody>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 10px;">Diagnostic Test</td>
                    <td style="padding: 10px; text-align: center;">5</td>
                    <td style="padding: 10px; text-align: center; font-weight: 700;">${studentData.diagnosticScore || 0}%</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 10px;">Level Comprehension</td>
                    <td style="padding: 10px; text-align: center;">10</td>
                    <td style="padding: 10px; text-align: center; font-weight: 700;">${studentData.levelQuizScore || 'N/A'}%</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 10px;">Final Assessment</td>
                    <td style="padding: 10px; text-align: center;">10</td>
                    <td style="padding: 10px; text-align: center; font-weight: 700;">${studentData.comprehensionScore || 'N/A'}%</td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <div class="section">
        <div class="section-title">💡 TEACHER OBSERVATIONS</div>
        <p><strong>Learning Pathway:</strong> Student demonstrated ${getProgressDescription(studentData.diagnosticScore)} understanding in diagnostic assessment, leading to ${getLevelName(studentData.level)} learning pathway.</p>
        <p><strong>Engagement:</strong> Student actively participated in all phases of the adaptive learning system, completing diagnostic, level-specific content, and final assessments.</p>
        <p><strong>Outcome:</strong> Successfully mastered core concepts of light characteristics through personalized instruction adapted to individual learning pace.</p>
    </div>
    
    <div class="signature-section">
        <div class="signature-box">
            <div class="signature-line">Teacher Signature</div>
        </div>
        <div class="signature-box">
            <div class="signature-line">Date</div>
        </div>
    </div>
    
    <div class="footer">
        <p><strong>JIS Adaptive Learning System</strong></p>
        <p>This report was automatically generated by the Adaptive Learning Platform</p>
        <p>Printed on: ${new Date().toLocaleString()}</p>
    </div>
</body>
</html>
    `;
    
    return template;
}

function getLevelName(level) {
    const names = {
        'foundation': 'Foundation Builder',
        'explorer': 'Knowledge Explorer',
        'master': 'Concept Master',
        'basic': 'Foundation Builder',
        'intermediate': 'Knowledge Explorer',
        'advanced': 'Concept Master'
    };
    return names[level] || level;
}

function getProgressDescription(score) {
    if (score >= 80) return 'strong';
    if (score >= 50) return 'moderate';
    return 'developing';
}

module.exports = { generatePDFReport };
