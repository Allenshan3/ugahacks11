import { NextResponse } from 'next/server';
import { extractATSKeywords } from '../../lib/groq';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Convert the file to a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Import pdf2json
    const PDFParser = (await import('pdf2json')).default;
    const pdfParser = new (PDFParser as any)(null, 1);

    // Parse PDF using Promise
    const parsePromise = new Promise<{ text: string; numPages: number }>((resolve, reject) => {
      pdfParser.on('pdfParser_dataError', (errData: any) => {
        reject(new Error(errData.parserError));
      });

      pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
        try {
          // Extract text from all pages
          const text = pdfData.Pages.map((page: any) => {
            return page.Texts.map((textItem: any) => {
              return decodeURIComponent(textItem.R[0].T);
            }).join(' ');
          }).join('\n\n');

          resolve({
            text,
            numPages: pdfData.Pages.length,
          });
        } catch (err) {
          reject(err);
        }
      });

      pdfParser.parseBuffer(buffer);
    });

    const data = await parsePromise;

    // Extract ATS keywords using Groq/OpenAI
    let atsKeywords = '';
    try {
      atsKeywords = await extractATSKeywords(data.text); // Fixed: use data.text
      console.log('==================== ATS KEYWORDS ====================');
      console.log(atsKeywords);
      console.log('====================================================');
    } catch (error) {
      console.error('Failed to extract ATS keywords:', error);
    }

    return NextResponse.json({
      success: true,
      text: data.text, // Fixed: use data.text
      numPages: data.numPages, // Fixed: use data.numPages (capital P)
      atsKeywords: atsKeywords,
    });

  } catch (error) {
    console.error('Error parsing PDF:', error);
    return NextResponse.json(
      { error: 'Failed to parse PDF: ' + (error as Error).message },
      { status: 500 }
    );
  }
}