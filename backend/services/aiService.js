const OpenAI = require('openai');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
}) : null;

if (!openai) {
    console.warn("WARNING: OPENAI_API_KEY is not set. AI features will not work.");
}

exports.parseRFPRequirements = async (prompt) => {
    if (!openai) throw new Error("OpenAI API Key not configured.");
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are an expert procurement assistant. Your goal is to extract structured data from a natural language RFP description.
          Return ONLY a JSON object with the following schema:
          {
            "title": "Short descriptive title",
            "items": [
              { "name": "Item name", "quantity": number, "specs": "Technical specs" }
            ],
            "budget": "Budget string or number",
            "timeline": "Delivery or project timeline",
            "payment_terms": "Payment terms if mentioned",
            "warranty_requirements": "Warranty info if mentioned"
          }`
                },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
        console.error("AI Parsing Error:", error);
        // Fallback or rethrow
        throw new Error("Failed to parse RFP requirements with AI.");
    }
};

exports.parseProposal = async (emailText) => {
    if (!openai) {
        console.warn("OpenAI API Key not configured. Skipping AI parsing.");
        return null;
    }
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are an expert procurement assistant. Your goal is to extract structured data from a vendor's email proposal.
          Return ONLY a JSON object with the following schema:
          {
            "price": "Total price or price breakdown",
            "delivery_date": "Proposed delivery date or timeline",
            "warranty": "Warranty details",
            "payment_terms": "Payment terms",
            "summary": "Brief summary of the proposal",
            "confidence_score": number (0-100)
          }`
                },
                { role: "user", content: emailText }
            ],
            response_format: { type: "json_object" }
        });

        return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
        console.error("AI Proposal Parsing Error:", error);
        return null;
    }
};

exports.compareProposals = async (rfpText, proposals) => {
    if (!openai) {
        console.warn("OpenAI API Key not configured. Skipping AI comparison.");
        return null; // Return null if no AI
    }

    // Prepare proposal summaries for the prompt
    const proposalsText = proposals.map(p => {
        return `Vendor ID: ${p.Vendor ? p.Vendor.id : p.vendorId}, Name: ${p.Vendor ? p.Vendor.name : 'Unknown'}, Extracted Data: ${JSON.stringify(p.extracted_data)}`;
    }).join("\n\n");

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are an expert procurement analyst.
          Your task is to compare multiple vendor proposals against an RFP requirement and recommend the best one.
          
          Input:
          1. RFP Requirements (User Prompt)
          2. List of Vendor Proposals (JSON data)
          
          Output JSON Schema:
          {
            "recommended_vendor_id": number,
            "reasoning": "A clear, persuasive paragraph explaining why this vendor is the best choice compared to others (mention price, timeline, quality, etc).",
            "key_factors": ["Factor 1", "Factor 2"],
            "pros_cons_by_vendor": {
              "vendor_id_string": {
                 "pros": ["pro 1", "pro 2"],
                 "cons": ["con 1", "con 2"]
              }
            }
          }
          
          Be objective and decisive.`
                },
                {
                    role: "user",
                    content: `RFP Requirements: ${rfpText}\n\nVendor Proposals:\n${proposalsText}`
                }
            ],
            response_format: { type: "json_object" }
        });

        return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
        console.error("AI Comparison Error:", error);
        return null;
    }
};
