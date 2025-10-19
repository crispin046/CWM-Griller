import { GoogleGenAI } from "@google/genai";
import type { Repository } from '../types';

function formatContextForPrompt(repoData: Repository): string {
    let context = `Repository: ${repoData.name}\n\n`;

    context += "Recent Commits:\n";
    repoData.commits.forEach(c => {
        context += `- ${c.sha.substring(0, 7)} by ${c.author.login}: ${c.message.split('\n')[0]} (${new Date(c.date).toLocaleString()})\n`;
    });

    context += "\nActive Issues:\n";
    repoData.issues.forEach(i => {
        context += `- #${i.id} (${i.state}) by ${i.user.login}: ${i.title}\n`;
    });

    context += "\nRecent Pull Requests:\n";
    repoData.pullRequests.forEach(p => {
        context += `- #${p.id} (${p.state}) by ${p.user.login}: ${p.title}\n`;
    });

    return context;
}

export async function summarizeContext(repoData: Repository, userQuery?: string): Promise<string> {
    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
      throw new Error("Gemini API key not found. Please set the API_KEY environment variable to use the AI summarization feature.");
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const model = "gemini-2.5-flash";
    
    const formattedContext = formatContextForPrompt(repoData);
    
    const systemInstruction = `You are CWM Griller, an AI assistant that helps development teams understand project context. Your task is to analyze Git repository data and generate a clear, well-structured summary.

Your output MUST be in Markdown and follow this structure:
1.  **Main Title:** Start with "## Project Recap: [Repo Name]".
2.  **Overview:** A brief, one-paragraph summary of the recent project momentum.
3.  **Key Activities:** A section titled "### Key Activities" with a bulleted list of significant recent events (merged PRs, important commits). Use bold text for user names and PR/issue numbers (e.g., "**#123**", "**@username**").
4.  **Open Items:** A section titled "### ⏳ Action Required" for pending work. List open pull requests and issues, highlighting their status (e.g., "**[OPEN]**").
5.  **Contributors:** A final, brief section "### Key Contributors" listing the most active users.

The tone should be professional, concise, and helpful.`;
    
    const queryPrompt = userQuery
        ? `Based on the context provided below, please answer the following user question: "${userQuery}"`
        : "Based on the context provided below, generate a 'last-session summary' that tells a developer what was happening recently in the project. Focus on key activities, pending work (like open PRs and issues), and who was involved.";

    const fullPrompt = `${queryPrompt}\n\n---\n\n**Repository Context:**\n\n${formattedContext}`;
    
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: fullPrompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate summary from Gemini API. The API key might be invalid or the service may be unavailable.");
    }
}