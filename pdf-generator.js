// PDF REPORT GENERATOR - Professional Print-Ready Reports
// This generates beautiful PDF reports for each student

const generatePDFReport = (student) => {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Learning Report - ${student.name}</title>
    <style>
        @page {
            size: A4;
            margin: 20mm;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #1a202c;
        }
        
        .letterhead {
            border-bottom: 4px solid #1a365d;
            padding-bottom: 20px;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .school-name {
            font-size: 24pt;
            font-weight: bold;
            color: #1a365d;
            margin-bottom: 5px;
        }
        
        .school-subtitle {
            font-size: 14pt;
            color: #2c5282;
            margin-bottom: 3px;
        }
        
        .report-title {
            font-size: 18pt;
            font-weight: bold;
            color: #ed8936;
            margin-top: 15px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 25px 0;
            padding: 20px;
            background: #f7fafc;
            border-radius: 8px;
        }
        
        .info-item {
            padding: 10px;
        }
        
        .info-label {
            font-weight: bold;
            color: #2c5282;
            font-size: 10pt;
        }
        
        .info-value {
            font-size: 11pt;
            margin-top: 3px;
        }
        
        .section {
            margin: 30px 0;
            page-break-inside: avoid;
        }
        
        .section-header {
            background: linear-gradient(to right, #1a365d, #2c5282);
            color: white;
            padding: 12px 20px;
            font-size: 14pt;
            font-weight: bold;
            border-radius: 5px;
            margin-bottom: 15px;
        }
        
        .subsection {
            margin: 20px 0;
            padding-left: 15px;
            border-left: 3px solid #ed8936;
        }
        
        .subsection-title {
            font-size: 12pt;
            font-weight: bold;
            color: #1a365d;
            margin-bottom: 10px;
        }
        
        .metric-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin: 15px 0;
        }
        
        .metric-box {
            text-align: center;
            padding: 15px;
            background: #f7fafc;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
        }
        
        .metric-value {
            font-size: 24pt;
            font-weight: bold;
            color: #1a365d;
        }
        
        .metric-label {
            font-size: 10pt;
            color: #718096;
            margin-top: 5px;
        }
        
        .journey-item {
            padding: 12px;
            margin: 10px 0;
            background: #fff;
            border-left: 4px solid #ed8936;
            border-radius: 4px;
        }
        
        .journey-title {
            font-weight: bold;
            color: #1a365d;
            margin-bottom: 5px;
        }
        
        .journey-detail {
            font-size: 10pt;
            color: #4a5568;
        }
        
        .highlight-box {
            background: #fef5e7;
            border: 2px solid #f6ad55;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
        
        .highlight-title {
            font-weight: bold;
            color: #7c2d12;
            margin-bottom: 8px;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            font-size: 9pt;
            color: #718096;
        }
        
        .signature-section {
            margin-top: 40px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
        }
        
        .signature-box {
            text-align: center;
            padding-top: 40px;
            border-top: 2px solid #1a202c;
        }
        
        .print-date {
            text-align: right;
            font-size: 9pt;
            color: #718096;
            margin-bottom: 20px;
        }
        
        @media print {
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    <!-- LETTERHEAD -->
    <div class="letterhead">
        <div class="school-name">JUBAIL INTERNATIONAL SCHOOL</div>
        <div class="school-subtitle">Adaptive Learning System</div>
        <div class="school-subtitle" style="font-size: 12pt;">Physics Department</div>
        <div class="report-title">COMPREHENSIVE LEARNING REPORT</div>
    </div>
    
    <div class="print-date">Report Generated: ${new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}</div>
    
    <!-- STUDENT INFORMATION -->
    <div class="info-grid">
        <div class="info-item">
            <div class="info-label">STUDENT NAME</div>
            <div class="info-value">${student.name}</div>
        </div>
        <div class="info-item">
            <div class="info-label">STUDENT ID</div>
            <div class="info-value">${student.studentID}</div>
        </div>
        <div class="info-item">
            <div class="info-label">CLASS</div>
            <div class="info-value">${student.class}</div>
        </div>
        <div class="info-item">
            <div class="info-label">TEACHER</div>
            <div class="info-value">Aalia Shaheen</div>
        </div>
        <div class="info-item">
            <div class="info-label">TOPIC</div>
            <div class="info-value">Characteristics of Light</div>
        </div>
        <div class="info-item">
            <div class="info-label">DATE COMPLETED</div>
            <div class="info-value">${student.timestamps?.assessmentEnd ? 
                new Date(student.timestamps.assessmentEnd).toLocaleDateString() : 'In Progress'}</div>
        </div>
    </div>
    
    <!-- PERFORMANCE SUMMARY -->
    <div class="section">
        <div class="section-header">📊 PERFORMANCE SUMMARY</div>
        
        <div class="metric-grid">
            <div class="metric-box">
                <div class="metric-value">${student.diagnosticScore || 0}%</div>
                <div class="metric-label">Initial Diagnostic</div>
            </div>
            <div class="metric-box">
                <div class="metric-value">${student.postCore?.score || 0}/${student.postCore?.answers?.length || 0}</div>
                <div class="metric-label">Final Assessment</div>
            </div>
            <div class="metric-box">
                <div class="metric-value" style="color: ${
                    (student.postCore?.score || 0) - (student.diagnosticScore || 0) >= 0 ? '#38a169' : '#e53e3e'
                }">
                    ${(student.postCore?.score || 0) - (student.diagnosticScore || 0) > 0 ? '+' : ''}${
                        (student.postCore?.score || 0) - (student.diagnosticScore || 0)
                    }%
                </div>
                <div class="metric-label">Growth</div>
            </div>
        </div>
        
        <div class="highlight-box">
            <div class="highlight-title">Entry Level Identified</div>
            <div>Starting Point: <strong>${student.level === 'basic' ? 'Foundation Builder' : 
                student.level === 'intermediate' ? 'Knowledge Explorer' : 'Concept Master'}</strong></div>
        </div>
    </div>
    
    <!-- LEARNING JOURNEY -->
    <div class="section">
        <div class="section-header">🗺️ COMPLETE LEARNING JOURNEY</div>
        
        <div class="subsection">
            <div class="subsection-title">Phase 1: Adaptive Diagnostic Assessment</div>
            <div class="journey-item">
                <div class="journey-title">Initial Assessment Completed</div>
                <div class="journey-detail">
                    Score: ${student.diagnosticScore || 0}% | 
                    Assigned Level: ${student.level === 'basic' ? 'Foundation Builder' : 
                        student.level === 'intermediate' ? 'Knowledge Explorer' : 'Concept Master'}
                </div>
                <div class="journey-detail">
                    Time: ${student.timestamps?.diagnosticEnd ? 
                        new Date(student.timestamps.diagnosticEnd).toLocaleString() : 'N/A'}
                </div>
            </div>
        </div>
        
        <div class="subsection">
            <div class="subsection-title">Phase 2: Personalized Learning Path</div>
            <div class="journey-item">
                <div class="journey-title">Customized Content Delivery</div>
                <div class="journey-detail">
                    Level: ${student.level === 'basic' ? 'Foundation Builder' : 
                        student.level === 'intermediate' ? 'Knowledge Explorer' : 'Concept Master'}
                </div>
                <div class="journey-detail">
                    ${student.levelHistory?.length || 0} level transition(s) during learning
                </div>
            </div>
        </div>
        
        <div class="subsection">
            <div class="subsection-title">Phase 3: Core Instruction (Universal Convergence)</div>
            <div class="journey-item">
                <div class="journey-title">All Students Converged at Core Concepts</div>
                <div class="journey-detail">
                    Received unified instruction on essential physics principles
                </div>
                <div class="journey-detail">
                    Completed: ${student.timestamps?.instructionEnd ? 
                        new Date(student.timestamps.instructionEnd).toLocaleString() : 'N/A'}
                </div>
            </div>
        </div>
        
        <div class="subsection">
            <div class="subsection-title">Phase 4: Post-Instruction Assessment</div>
            <div class="journey-item">
                <div class="journey-title">Understanding Verification</div>
                <div class="journey-detail">
                    Final Score: ${student.postCore?.score || 0}/${student.postCore?.answers?.length || 5} 
                    (${Math.round(((student.postCore?.score || 0) / (student.postCore?.answers?.length || 5)) * 100)}%)
                </div>
                <div class="journey-detail">
                    Completed: ${student.timestamps?.assessmentEnd ? 
                        new Date(student.timestamps.assessmentEnd).toLocaleString() : 'N/A'}
                </div>
            </div>
        </div>
    </div>
    
    <!-- TEACHER OBSERVATIONS -->
    <div class="section">
        <div class="section-header">📝 TEACHER OBSERVATIONS & RECOMMENDATIONS</div>
        
        <div class="subsection">
            <div class="subsection-title">Strengths Demonstrated</div>
            <ul style="margin-left: 20px; margin-top: 10px;">
                ${student.diagnosticScore >= 60 ? '<li>Strong foundational understanding</li>' : ''}
                ${(student.postCore?.score || 0) >= 4 ? '<li>Excellent comprehension of core concepts</li>' : ''}
                ${student.journey?.filter(j => j.result === 'Correct').length > 5 ? 
                    '<li>Consistent performance across learning phases</li>' : ''}
            </ul>
        </div>
        
        <div class="subsection">
            <div class="subsection-title">Areas for Continued Focus</div>
            <ul style="margin-left: 20px; margin-top: 10px;">
                ${student.diagnosticScore < 60 ? '<li>Continue building foundational concepts</li>' : ''}
                ${(student.postCore?.score || 0) < 3 ? '<li>Review core principles with additional practice</li>' : ''}
                <li>Apply concepts through real-world problem-solving</li>
            </ul>
        </div>
        
        <div class="highlight-box" style="background: #e6fffa; border-color: #38a169;">
            <div class="highlight-title" style="color: #22543d;">Overall Assessment</div>
            <div>
                ${(student.postCore?.score || 0) >= 4 ? 
                    'Excellent mastery of the material demonstrated. Ready to progress to advanced topics.' :
                (student.postCore?.score || 0) >= 3 ?
                    'Good understanding of core concepts. Continue practicing application problems.' :
                    'Foundational concepts understood. Recommend additional review and practice.'}
            </div>
        </div>
    </div>
    
    <!-- SIGNATURES -->
    <div class="signature-section">
        <div class="signature-box">
            <div style="font-weight: bold;">Teacher Signature</div>
            <div style="margin-top: 5px; font-size: 10pt;">Aalia Shaheen</div>
        </div>
        <div class="signature-box">
            <div style="font-weight: bold;">Date</div>
            <div style="margin-top: 5px; font-size: 10pt;">${new Date().toLocaleDateString()}</div>
        </div>
    </div>
    
    <!-- FOOTER -->
    <div class="footer">
        <div>Generated by JIS Adaptive Learning System</div>
        <div style="margin-top: 5px;">This report is confidential and intended for educational purposes only.</div>
    </div>
</body>
</html>
    `;
    
    return html;
};

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generatePDFReport };
}
