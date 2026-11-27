import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

function hasConfiguredGeminiKey(): boolean {
  const key = process.env.GEMINI_API_KEY?.trim();
  return Boolean(key && key !== "MY_GEMINI_API_KEY");
}

function getGeminiClient(): GoogleGenAI | null {
  if (!hasConfiguredGeminiKey()) {
    return null;
  }
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/ai-status", (_req, res) => {
    const configured = hasConfiguredGeminiKey();
    res.json({
      configured,
      provider: configured ? "gemini-4-hydrogen" : "demonstration-simulation",
    });
  });

  app.post("/api/analyze-evidence", async (req, res) => {
    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        configured: false,
        error:
          "Live AI analysis is not configured in this environment. Switch to Demonstration Mode to inspect simulated competency analysis.",
      });
      return;
    }

    const { project, skills, qualifications } = req.body ?? {};
    if (!project || typeof project.title !== "string") {
      res.status(400).json({ error: "A valid project payload is required for evidence analysis." });
      return;
    }

    try {
      const prompt = `
You are an evidence-to-skills analyst for SkillProof, a credential recognition and skills validation platform for displaced and refugee professionals (ILO Track 1).
CRITICAL GUARDRAILS:
1. You are analyzing ONLY the text and metadata submitted by the candidate below. You have NOT fetched or inspected the external GitHub repository code directly. State this clearly in limitations.
2. You are NOT an official qualification authority and CANNOT grant official verification or qualification equivalence. All suggested competencies remain AI-suggested until reviewed by a qualified human assessor.
3. Be concrete, balanced, and constructive. Identify evidence gaps and practical next steps for verification.

SUBMITTED CANDIDATE CONTEXT:
Project Title: ${String(project.title).slice(0, 200)}
Description: ${String(project.description || "").slice(0, 1200)}
Problem Addressed: ${String(project.problemAddressed || "").slice(0, 800)}
Solution Developed: ${String(project.solutionDeveloped || "").slice(0, 800)}
Candidate Role & Contributions: ${String(project.roleAndContributions || "").slice(0, 800)}
Technologies Used: ${Array.isArray(project.technologies) ? project.technologies.join(", ") : ""}
Submitted GitHub URL: ${String(project.githubUrl || "None provided")}
Submitted Live Demo URL: ${String(project.liveDemoUrl || "None provided")}
Supporting Evidence Notes: ${String(project.supportingEvidence || "").slice(0, 800)}
Claimed Skills: ${Array.isArray(skills) ? skills.map((s: { name: string; status: string }) => `${s.name} (${s.status})`).join("; ") : "None"}
Qualifications: ${Array.isArray(qualifications) ? qualifications.map((q: { title: string; institution: string; country: string; year: string }) => `${q.title} — ${q.institution}, ${q.country} (${q.year})`).join("; ") : "None"}

Return structured competency suggestions matching the schema.
`;

      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: prompt,
        config: {
          systemInstruction:
            "Provide concise, objective, evidence-grounded competency interpretations for displaced professionals. Never fabricate repository inspection results or claim official verification.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description:
                  "A 2-3 sentence summary based strictly on the submitted project information.",
              },
              competencies: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    skillName: { type: Type.STRING },
                    category: { type: Type.STRING },
                    supportingEvidence: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    evidenceLimitations: { type: Type.STRING },
                    recommendedAssessment: { type: Type.STRING },
                    recommendedNextStep: { type: Type.STRING },
                  },
                },
              },
            },
          },
        },
      });

      const rawText = (response.text ?? "{}").trim();
      const parsed = JSON.parse(rawText);
      res.json({
        configured: true,
        source: "live-gemini-ai",
        analysisNote:
          "AI-assisted interpretation based solely on candidate-submitted project information. External repository contents were not automatically fetched. Requires human assessor review.",
        summary: parsed.summary || "",
        competencies: Array.isArray(parsed.competencies) ? parsed.competencies : [],
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to run Gemini evidence analysis.";
      res.status(502).json({
        configured: true,
        error: message,
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("/{*path}", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SkillProof server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
