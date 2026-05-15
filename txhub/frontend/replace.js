const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'src');

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const newContent = content.replace(/http:\/\/192\.168\.1\.\d+:8000/g, 'http://127.0.0.1:8000');
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

replaceInDir(dirPath);
console.log('Done.');
