<div align="center">
  <img width="1200" alt="CWM Griller Interface" src="./CWM Griller.png" />
</div>

# 🧠 CWM Griller — Contextual Workflow Memory for Public GitHub Repositories  
**Built with Google Genkit + Vertex AI | Build With AI Challenge (Genkit Track)**  

🌐 **Live Application:** [https://cwm-griller-123372964295.us-west1.run.app/](https://cwm-griller-123372964295.us-west1.run.app/)

---

## 🧩 Problem

Developers and businesses rely heavily on open-source software, yet understanding **what a public repository actually does** often requires digging through commits, issues, and READMEs.  

- New contributors struggle to grasp project purpose and recent activity.  
- Product managers and teams waste time reviewing technical details.  
- Organizations evaluating open-source tools have no quick way to extract insights.  

There’s **no easy, AI-driven way** to summarize a repository’s context and history at a glance.  

---

## 💡 Solution — *CWM Griller (Contextual Workflow Memory)*

**CWM Griller** is an AI-powered summarizer for public GitHub repositories.  
It automatically builds a *contextual memory* of any repo and explains its purpose, activity trends, and focus — just by entering the repo URL.  

Using **Google Genkit** pipelines and **Vertex AI**, CWM Griller:  
- Fetches commits, PRs, and issues from any public GitHub repository.  
- Embeds and analyzes this data to capture meaning and intent.  
- Generates a **human-readable summary** — e.g.:  
  > “This repository is a Python-based data visualization library focused on interactive charts. Recent commits improve performance and add TypeScript support.”  

---

## ⚙️ How It Works

1. **User Input** → Paste any public GitHub repo link.  
2. **Data Collection** → The app retrieves metadata, commits, and issues using GitHub’s REST API.  
3. **AI Processing** →  
   - Genkit orchestrates the pipeline for data retrieval and summarization.  
   - Vertex AI embeddings capture semantic relationships.  
   - Gemini models generate natural summaries of project purpose and recent work.  
4. **Output** → A concise, contextual summary of the repository.  

---

## 🧰 Tech Stack

| Component | Purpose |
|------------|----------|
| **Google Genkit** | Pipeline orchestration and AI workflow automation |
| **Vertex AI (Gemini + Embeddings)** | Semantic understanding and summarization |
| **GitHub REST API** | Source for public repo data |
| **Node.js + TypeScript** | Backend implementation |
| **AI Studio** | App interface and hosting |
| **GitHub Codespaces** | Cloud-based runtime environment |

---

## 💼 Business & Workflow Relevance

| Challenge | Real-World Use | Value |
|------------|----------------|-------|
| Slow repo analysis | Developer onboarding | Quick understanding of new codebases |
| Poor visibility | Enterprise due diligence | AI-driven insights on dependencies |
| Manual reading | Product research | Automatic summarization of competitor repos |

---


