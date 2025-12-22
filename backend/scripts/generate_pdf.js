const fs = require('fs');
const path = require('path');

const objects = [
    // 1: Catalog
    `<< /Type /Catalog /Outlines 2 0 R /Pages 3 0 R >>`,
    // 2: Outlines
    `<< /Type /Outlines /Count 0 >>`,
    // 3: Pages
    `<< /Type /Pages /Kids [4 0 R] /Count 1 >>`,
    // 4: Page
    `<< /Type /Page /Parent 3 0 R /MediaBox [0 0 612 792] /Contents 5 0 R /Resources << /ProcSet [/PDF /Text] /Font << /F1 6 0 R >> >> >>`,
    // 5: Content stream
    `<< /Length 44 >>\nstream\nBT /F1 12 Tf 100 700 Td (Hello World) Tj ET\nendstream`,
    // 6: Font
    `<< /Type /Font /Subtype /Type1 /Name /F1 /BaseFont /Helvetica >>`
];

let fileContent = '%PDF-1.4\n';
let xref = ['0000000000 65535 f '];
let startxref = 0;

objects.forEach((objContent, index) => {
    const objId = index + 1;
    const offset = fileContent.length;
    // Format offset as 10 digit string
    const offsetStr = String(offset).padStart(10, '0');
    xref.push(`${offsetStr} 00000 n `);

    fileContent += `${objId} 0 obj\n${objContent}\nendobj\n`;
});

startxref = fileContent.length;

fileContent += 'xref\n';
fileContent += `0 ${objects.length + 1}\n`;
xref.forEach(line => fileContent += line + '\n');

fileContent += 'trailer\n';
fileContent += `<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
fileContent += 'startxref\n';
fileContent += `${startxref}\n`;
fileContent += '%%EOF\n';

const outputPath = path.resolve(__dirname, 'test_proposal.pdf');
fs.writeFileSync(outputPath, fileContent);
console.log(`PDF created at ${outputPath}`);
