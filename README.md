<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🧠 CWM Griller — The AI That Remembers GitHub Workflows  
**Powered by Google Genkit + Vertex AI**

---

## 🧩 Problem
Developers and open-source contributors lose hours reconstructing *context* behind commits, pull requests, and issues—especially in **public GitHub repositories**.  
Each time someone revisits a repo they must piece together what changed, why, and what’s still pending.  
This **context loss** slows onboarding, causes repeated work, and breaks project continuity.

---

## 💡 Solution
**CWM Griller (Contextual Workflow Memory)** turns public GitHub repos into **AI-powered memory systems**.  
Using **Google Genkit** and **Vertex AI**, it automatically extracts, embeds, and summarizes repository activity so anyone can instantly recall what’s been done and why.

Ask questions like:
- “What changed in the last 5 commits?”  
- “Summarize all open issues about API errors.”  
- “What was the focus of the latest release?”

---

## ⚙️ How It Works
1. **Data Extraction** – Fetches commits, issues, and PRs from any public GitHub repo.  
2. **Embedding & Memory Graph** – Uses Vertex AI embeddings to build a contextual graph.  
3. **Recall & Summarization** – Genkit pipelines retrieve and summarize context using Gemini models.  
4. **Query Interface** – Ask natural-language questions in a terminal or web UI.

```bash
> griller recall tensorflow/tensorflow
"The last 5 commits focused on documentation updates and performance tuning."
