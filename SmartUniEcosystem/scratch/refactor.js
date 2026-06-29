const fs = require('fs');
const path = require('path');

const srcDir = path.join(process.cwd(), 'src');
const envPath = path.join(srcDir, 'environments', 'environment.ts');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.ts') && fullPath !== envPath) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      if (content.includes('http://localhost:8080')) {
        // Replace single quotes and double quotes with template literal containing environment.apiUrl
        content = content.replace(/'http:\/\/localhost:8080\/?(.*?)'/g, '`${environment.apiUrl}/$1`');
        content = content.replace(/"http:\/\/localhost:8080\/?(.*?)"/g, '`${environment.apiUrl}/$1`');
        
        // Handle bare http://localhost:8080 within existing template literals
        content = content.replace(/http:\/\/localhost:8080/g, '${environment.apiUrl}');
        content = content.replace(/\$\{environment\.apiUrl\}\/\`/g, '${environment.apiUrl}`');

        const relativeEnvPath = path.relative(path.dirname(fullPath), envPath).replace(/\\/g, '/').replace('.ts', '');
        let importStmt = `import { environment } from '${relativeEnvPath.startsWith('.') ? relativeEnvPath : './' + relativeEnvPath}';\n`;
        
        if (!content.includes('import { environment }')) {
          const importMatch = content.match(/^import .*?;\n/gm);
          if (importMatch) {
            const lastImport = importMatch[importMatch.length - 1];
            content = content.replace(lastImport, lastImport + importStmt);
          } else {
            content = importStmt + content;
          }
        }
        
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + fullPath);
      }
    }
  }
}

processDir(srcDir);
