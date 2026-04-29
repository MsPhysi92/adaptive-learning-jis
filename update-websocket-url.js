// update-websocket-url.js
// Helper script to update WebSocket URLs for production deployment

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('\n🔧 WebSocket URL Update Tool\n');
console.log('This script will update WebSocket URLs in student.html and teacher.html');
console.log('for production deployment on Render.\n');

rl.question('Enter your Render app URL (e.g., my-app.onrender.com): ', (url) => {
    if (!url) {
        console.log('❌ No URL provided. Exiting.');
        rl.close();
        return;
    }

    // Clean the URL
    url = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const websocketUrl = `wss://${url}`;

    console.log(`\n✅ Will update to: ${websocketUrl}\n`);

    // Update student.html
    try {
        let studentContent = fs.readFileSync('student.html', 'utf8');
        const studentOriginal = studentContent;
        
        // Replace localhost WebSocket URL
        studentContent = studentContent.replace(
            /ws\s*=\s*new\s+WebSocket\s*\(\s*['"]ws:\/\/localhost:\d+['"]\s*\)/g,
            `ws = new WebSocket('${websocketUrl}')`
        );

        if (studentContent !== studentOriginal) {
            fs.writeFileSync('student.html', studentContent);
            console.log('✅ Updated student.html');
        } else {
            console.log('⚠️  student.html - No changes needed (already updated?)');
        }
    } catch (error) {
        console.log('❌ Error updating student.html:', error.message);
    }

    // Update teacher.html
    try {
        let teacherContent = fs.readFileSync('teacher.html', 'utf8');
        const teacherOriginal = teacherContent;
        
        // Replace localhost WebSocket URL
        teacherContent = teacherContent.replace(
            /ws\s*=\s*new\s+WebSocket\s*\(\s*['"]ws:\/\/localhost:\d+['"]\s*\)/g,
            `ws = new WebSocket('${websocketUrl}')`
        );

        if (teacherContent !== teacherOriginal) {
            fs.writeFileSync('teacher.html', teacherContent);
            console.log('✅ Updated teacher.html');
        } else {
            console.log('⚠️  teacher.html - No changes needed (already updated?)');
        }
    } catch (error) {
        console.log('❌ Error updating teacher.html:', error.message);
    }

    console.log('\n🎉 Done! WebSocket URLs updated.');
    console.log('\n📝 Next steps:');
    console.log('   1. git add .');
    console.log('   2. git commit -m "Update WebSocket URLs for production"');
    console.log('   3. git push');
    console.log('\nRender will auto-deploy your changes! 🚀\n');

    rl.close();
});
