# TruthLens AI — Universal Fact-Checking & Misinformation Detection Platform

**TruthLens AI** is an AI-powered universal fact-checking and misinformation detection platform. Built with **HTML as its primary language**, styled with an editorial navy CSS theme, and powered by client-side **JavaScript** for real-time investigation and analysis.

TruthLens AI verifies news headlines, statements, articles, website URLs, screenshots/images (OCR), and PDF documents across **18 automatically detected news categories** with live web search evidence and deep forensic reasoning.

---

## 🌟 Core Capabilities

### 1. Multi-Modal Input Formats
- **Text & Claims:** Check headlines, assertions, full articles, and viral messages.
- **Webpage URLs:** Investigate online articles directly by entering their link.
- **Image & Screenshot OCR:** Upload images or screenshots of news to extract text and inspect visual context using Gemini Vision.
- **PDF Documents:** In-browser PDF text extraction powered by PDF.js.

### 2. 18 Automatically Detected News Categories
Every submission is automatically classified into its corresponding domain, triggering category-specific verification protocols:
1. Politics and Elections
2. Geopolitics and International Relations
3. Wars, Conflicts, and Diplomacy
4. Sports and Tournaments
5. Business and Finance
6. Economics and Government Policies
7. Science and Research
8. Technology and Artificial Intelligence
9. Health and Medicine
10. Entertainment and Celebrities
11. Education
12. Crime and Law
13. Environment and Climate
14. History
15. Social Issues
16. Government Announcements
17. International News
18. Other and Miscellaneous Topics

### 3. Editorial Verification Report Structure
- **Core Verdict & Overview:** Prominent visual verdict (`Likely True`, `Likely False`, `Misleading`, `Unverified`, `Outdated`, `Partially True`, `Satire / Parody`) with confidence rating and evidence credibility score (0–100).
- **Executive Summary:** Concise 100–150 word summary of findings with an expandable option for complete, detailed explanations.
- **Claim Verification:** Decomposes content into atomic claims with individual verdicts, explanations, supporting evidence, contradicting evidence, and open questions.
- **Evidence Comparison:** Side-by-side comparison of supporting and contradicting authoritative sources with verified clickable citations, cross-source consensus, and divergences.
- **Source Credibility:** Transparency evaluation (0–100), publisher accountability, author credentials, institutional oversight, and verifiable assertions.
- **Additional Forensic Analysis (Collapsible Accordions):**
  - **News Bias Analysis:** Linguistic tone, partisan skew, flagged sentences, and neutral rewrites.
  - **Headline Accuracy:** Headline accuracy score (0–100), clickbait severity rating, and recommended neutral headline.
  - **News Timeline & Recycled News:** Original event date vs. publication date to catch recycled stories.
  - **Missing Context:** Highlights omitted background, incomplete statistics, and impact on public perception.
  - **Manipulation Analysis:** Detects fearmongering, false urgency, artificial outrage, and conspiracy framing.
- **Final Assessment:** Conclusive reasoning, methodological disclosures & limitations, executed Tavily search queries, and clickable live citations.

### 4. Real Multi-Language Support
Full report translation available on-the-fly in 5 languages:
- **English** (Default)
- **Hindi** (हिन्दी)
- **Spanish** (Español)
- **French** (Français)
- **Arabic** (العربية - with native RTL layout)

---

## 📁 Project Structure

```text
c:\Users\Kabir\Desktop\project 3\
├── index.html       # Primary application markup (HTML5)
├── styles.css       # Editorial styling, animations & print stylesheet
├── app.js           # Client logic, Tavily search client & Gemini AI engine
├── serve.js         # Zero-dependency local server runner (optional)
└── README.md        # Comprehensive documentation
```

---

## 🚀 How to Run the Application

### Option A: Open Directly in Your Browser (No Server Needed!)
Simply double-click `index.html` or open it with Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.

### Option B: Run with the Zero-Dependency Server
If you prefer running through `http://localhost`:

```bash
node serve.js
```

Then open:
👉 **http://localhost:3000**

---

## 🔑 Pre-Configured Free-Tier API Keys

TruthLens AI is pre-configured with free-tier API keys:
- **Google Gemini API Key:** Pre-loaded in `app.js` and configurable in the Settings modal (`⚙️ Settings`).
- **Tavily Search API Key:** Pre-loaded in `app.js` and configurable in the Settings modal.

### Changing or Testing Keys
1. Click **⚙️ Settings** in the top navigation bar.
2. Enter or update your API keys.
3. Click **⚡ Test Connection** to verify live communication with both APIs.
4. Click **Save Settings**.
