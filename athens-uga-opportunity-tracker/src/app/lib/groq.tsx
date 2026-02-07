import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function extractATSKeywords(resumeText: string) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an ATS (Applicant Tracking System) keyword expert. Extract relevant keywords from resumes including skills, technologies, job titles, certifications, and important industry terms. Return them as a comma-separated list.",
        },
        {
          role: "user",
          content: `Extract ATS keywords from this resume.:\n\n${resumeText}`,
        },
      ],
      model: "openai/gpt-oss-20b", 
    });

    const keywords = chatCompletion.choices[0]?.message?.content || "";
    return keywords;
  } catch (error) {
    console.error("Error extracting ATS keywords:", error);
    throw error;
  }
}