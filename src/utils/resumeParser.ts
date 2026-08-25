// services/resumeParser.ts
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

class ResumeParserService {
  async extractTextFromFile(file: File): Promise<string> {
    console.log('📄 Extracting text from:', file.name, file.type);
    
    try {
      // For PDF files
      if (file.type === 'application/pdf') {
        console.log('📄 Processing PDF...');
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n';
        }
        console.log('✅ PDF text extracted, length:', fullText.length);
        return fullText;
      }
      
      // For DOC/DOCX files
      if (file.type === 'application/msword' || 
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        console.log('📄 Processing DOC/DOCX...');
        
        try {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          
          if (result.value && result.value.trim().length > 0) {
            console.log('✅ DOCX text extracted, length:', result.value.length);
            return result.value;
          }
          
          throw new Error('No text extracted from DOCX');
        } catch (err) {
          console.error('❌ DOCX parsing error:', err);
          throw new Error(
            'Could not parse DOCX file. Please try converting to PDF format or upload a text file.\n' +
            'You can convert DOCX to PDF using:\n' +
            '1. Microsoft Word: File → Save As → PDF\n' +
            '2. Google Docs: File → Download → PDF\n' +
            '3. Online tools like ilovepdf.com or smallpdf.com'
          );
        }
      }
      
      // For text files
      if (file.type === 'text/plain') {
        const text = await file.text();
        console.log('✅ TXT text extracted, length:', text.length);
        return text;
      }
      
      throw new Error('Unsupported file format. Please upload PDF, DOC, DOCX, or TXT files.');
    } catch (error) {
      console.error('❌ Error extracting text:', error);
      throw error;
    }
  }

  async parseResumeWithAI(file: File, apiKey: string) {
    try {
      console.log('🚀 Starting resume parsing with AI...');
      
      // Extract text from resume
      const resumeText = await this.extractTextFromFile(file);
      
      if (!resumeText || resumeText.trim().length === 0) {
        throw new Error('Could not extract text from the resume. Please ensure the file is not empty.');
      }
      
      console.log('📝 Resume text preview:', resumeText.substring(0, 300) + '...');
      console.log('📊 Total text length:', resumeText.length);
      
      // Call ChatGPT API
      const parsedData = await this.callChatGPT(resumeText, apiKey);
      console.log('✅ Parsed data received:', parsedData);
      
      return parsedData;
    } catch (error) {
      console.error('❌ Error parsing resume with AI:', error);
      throw error;
    }
  }

  async callChatGPT(resumeText: string, apiKey: string) {
    const prompt = `
Extract the following information from this resume and return it as a JSON object.

Resume Text:
"""
${resumeText.substring(0, 6000)}
"""

Return ONLY a JSON object with these exact fields:

{
  "firstName": "",
  "lastName": "",
  "email": "",
  "phone": "",
  "dateOfBirth": "",
  "addressLine1": "",
  "addressLine2": "",
  "city": "",
  "county": "",
  "postcode": "",
  "nationality": "",
  "rightToWork": "",
  "skills": [],
  "experience": [],
  "education": []
}

Rules:
1. rightToWork: "British Citizen", "Indefinite Leave", "Skilled Worker Visa", "Student Visa", or "Other"
2. dateOfBirth: YYYY-MM-DD format
3. Use empty string if not found, empty array for skills/experience/education
4. Return ONLY valid JSON
`;

    try {
      console.log('🔄 Calling OpenAI API...');
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a resume parser. Return only valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1,
          max_tokens: 800
        })
      });

      console.log('📡 API Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        
        if (response.status === 401) {
          throw new Error('❌ Invalid OpenAI API Key. Please check your VITE_OPENAI_API_KEY in .env file.');
        } else if (response.status === 429) {
          throw new Error('❌ API rate limit exceeded. Please wait a moment and try again.');
        } else if (response.status === 404) {
          throw new Error('❌ API endpoint not found. Please check your API configuration.');
        } else {
          throw new Error(`❌ API error (${response.status}): ${errorText}`);
        }
      }

      const data = await response.json();
      console.log('✅ API Response received');
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response from OpenAI API');
      }

      const content = data.choices[0].message.content;
      console.log('📝 AI Response:', content);
      
      if (!content || content.trim().length === 0) {
        throw new Error('Empty response from OpenAI. Please check your API key and try again.');
      }
      
      // Parse the JSON response
      let parsedData;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[0]);
        } else {
          parsedData = JSON.parse(content);
        }
      } catch (parseError) {
        console.error('❌ Failed to parse JSON. Content was:', content);
        throw new Error('AI response was not valid JSON. Please try again.');
      }
      
      // Default values
      const defaultData = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        county: '',
        postcode: '',
        nationality: '',
        rightToWork: '',
        skills: [],
        experience: [],
        education: []
      };
      
      const result = { ...defaultData, ...parsedData };
      
      // Format date of birth if needed
      if (result.dateOfBirth && result.dateOfBirth.includes('/')) {
        const parts = result.dateOfBirth.split('/');
        if (parts.length === 3) {
          result.dateOfBirth = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error in callChatGPT:', error);
      throw error;
    }
  }
}

export default new ResumeParserService();