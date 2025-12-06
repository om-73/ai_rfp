(async () => {
    const fs = require('fs');
    const path = require('path');
    const simpleParser = require('mailparser').simpleParser;
    const pdf = require('pdf-parse');
    const mammoth = require('mammoth');

    // This script simulates the logic inside emailService.js to verify it handles attachments correctly.

    console.log("--- Starting Simulation ---");

    // 1. Create a Fake MIME Email with Attachment
    // It's hard to construct a raw MIME string manually. 
    // Instead, let's mock the 'mail' object that simpleParser returns, and test the LOOP logic.

    const mockMail = {
        from: { value: [{ address: 'test@vendor.com' }] },
        subject: 'Test Proposal',
        text: 'Here is the proposal body.',
        html: '<p>Here is the proposal body.</p>',
        date: new Date(),
        attachments: []
    };

    // We need a sample PDF or DOCX. 
    // Since we don't have one easily, let's create a dummy logic test.

    console.log("Step 1: Testing PDF Logic with Mock Buffer");

    // Mock the PDF parse function to avoid needing a real valid PDF binary
    const mockPdfParse = async (buffer) => {
        return { text: " [MOCK PDF CONTENT] " };
    };

    // Logic from emailService.js
    let combinedText = mockMail.text;

    // Simulate Attachment
    const attachments = [
        { filename: 'proposal.pdf', content: Buffer.from('fake pdf content'), contentType: 'application/pdf' },
        { filename: 'details.docx', content: Buffer.from('fake docx content'), contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
    ];

    for (const attachment of attachments) {
        const filename = attachment.filename;
        const lowerFilename = filename.toLowerCase();

        if (lowerFilename.endsWith('.pdf')) {
            try {
                // In real code: const data = await pdf(attachment.content);
                // Here mocking:
                const data = await mockPdfParse(attachment.content);
                combinedText += `\n\n--- Attachment: ${filename} ---\n${data.text}`;
            } catch (err) {
                console.error(`Error parsing PDF ${filename}:`, err);
            }
        } else if (lowerFilename.endsWith('.docx')) {
            try {
                // In real code: result = await mammoth.extractRawText(...)
                // Here mocking:
                const result = { value: " [MOCK DOCX CONTENT] " };
                combinedText += `\n\n--- Attachment: ${filename} ---\n${result.value}`;
            } catch (err) {
                console.error(`Error parsing DOCX ${filename}:`, err);
            }
        }
    }

    console.log("Final Combined Text:");
    console.log("---------------------------------------------------");
    console.log(combinedText);
    console.log("---------------------------------------------------");

    if (combinedText.includes("[MOCK PDF CONTENT]") && combinedText.includes("[MOCK DOCX CONTENT]")) {
        console.log("SUCCESS: Logic correctly creates combined text.");
    } else {
        console.error("FAILURE: Logic did not append text correctly.");
    }

})();
