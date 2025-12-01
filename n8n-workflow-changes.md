# N8N Workflow Changes for IPTV-Web Blog Automation

This file contains all the code snippets you need to update in your n8n workflow to generate IPTV blog posts.

---

## Node 1: "Find trending topics using Perplexity Sonar"

### System Message Content:
```
You are a trend analyst for an IPTV and streaming technology blog. Generate ONE unique, actionable topic that helps users with IPTV setup, troubleshooting, or optimization. Focus on practical guides, device-specific tutorials, and streaming solutions.
```

### User Message Content:
```javascript
={{ (function() {
const topics = [
    "How to fix IPTV buffering issues",
    "Best IPTV players for Firestick 2025",
    "TiviMate setup guide for beginners",
    "IPTV Smarters Pro vs TiviMate comparison",
    "How to setup IPTV on Apple TV",
    "Fix IPTV freezing and stuttering",
    "Best free IPTV players for Android",
    "How to use VPN with IPTV",
    "IPTV EPG not loading fix",
    "Kodi IPTV addon setup guide",
    "Best IPTV players for Samsung Smart TV",
    "How to record IPTV streams",
    "IPTV playlist format M3U explained",
    "Fix IPTV no audio problem",
    "Best IPTV players for iPhone and iPad",
    "How to setup IPTV on Nvidia Shield",
    "IPTV catchup and timeshift guide",
    "Best IPTV players with parental controls",
    "How to fix IPTV authentication errors",
    "IPTV multiscreen setup guide",
    "Best IPTV players for Mac",
    "How to optimize internet for IPTV",
    "IPTV vs cable TV comparison",
    "Best IPTV players with DVR features",
    "How to setup Xtream Codes API",
    "IPTV picture quality settings guide",
    "Best IPTV players for Windows PC",
    "How to fix IPTV black screen",
    "IPTV favorites and playlist management",
    "Best IPTV players for LG Smart TV",
    "JamRun IPTV setup guide for Apple devices",
    "GSE Smart IPTV setup tutorial",
    "VLC IPTV setup guide",
    "How to test IPTV stream quality",
    "IPTV channel logos not showing fix",
    "Best IPTV players with Chromecast support",
    "How to backup IPTV settings",
    "IPTV external player integration guide",
    "Best IPTV players for Android TV box",
    "How to fix IPTV connection timeout",
];

    const now = $now;
    const randomIndex = (now.toMillis() % topics.length);
    const selectedTopic = topics[randomIndex];

    return "Generate a blog post idea about: " + selectedTopic + "\n\n" +
        "Respond with ONLY a valid JSON object (no markdown, no extra text).\n\n" +
        "Example response format:\n" +
        '{"topic": "How to Fix IPTV Buffering Issues - Complete Guide 2025", "category": "Troubleshooting", "keywords": ["iptv buffering", "streaming issues", "fix buffering", "iptv lag"], "angle": "how-to guide"}\n\n' +
        "Now generate for: " + selectedTopic + "\n" +
        "Requirements: topic must be specific and SEO-optimized with year, category must be one of (Troubleshooting, Setup Guides, Player Comparisons, Device Guides, Optimization, Features), keywords must be 4 actual search terms, angle must be one of (how-to guide, troubleshooting, comparison, setup tutorial, optimization tips, feature deep-dive, beginner guide)";
})() }}
```

---

## Node 2: "Set Topic Data"

Update each assignment's value expression:

### Assignment 1 - `topic`:
```javascript
={{
  (() => {
    try {
      const content = $json.choices[0].message.content;
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const jsonMatch = cleanContent.match(/\{.*\}/s);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.topic;
      }
    } catch(e) {
      const topicMatch = content.match(/"topic"\s*:\s*"([^"]+)"/);
      if (topicMatch) return topicMatch[1];
    }
    return 'IPTV Setup Guide ' + new Date().toISOString().split('T')[0];
  })()
}}
```

### Assignment 2 - `category`:
```javascript
={{
  (() => {
    try {
      const content = $json.choices[0].message.content;
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const jsonMatch = cleanContent.match(/\{.*\}/s);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.category;
      }
    } catch(e) {
      const categoryMatch = content.match(/"category"\s*:\s*"([^"]+)"/);
      if (categoryMatch) return categoryMatch[1];
    }
    return 'Setup Guides';
  })()
}}
```

### Assignment 3 - `keywords`:
```javascript
={{
  (() => {
    try {
      const content = $json.choices[0].message.content;
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const jsonMatch = cleanContent.match(/\{.*\}/s);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.keywords;
      }
    } catch(e) {
      const keywordsMatch = content.match(/"keywords"\s*:\s*\[([^\]]+)\]/);
      if (keywordsMatch) {
        return JSON.parse('[' + keywordsMatch[1] + ']');
      }
    }
    return ["iptv", "streaming", "setup", "guide"];
  })()
}}
```

### Assignment 4 - `angle`:
```javascript
={{
  (() => {
    try {
      const content = $json.choices[0].message.content;
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const jsonMatch = cleanContent.match(/\{.*\}/s);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.angle;
      }
    } catch(e) {
      const angleMatch = content.match(/"angle"\s*:\s*"([^"]+)"/);
      if (angleMatch) return angleMatch[1];
    }
    return 'how-to guide';
  })()
}}
```

### Assignment 5 - `searchQuery`:
```javascript
={{
  (() => {
    try {
      const content = $json.choices[0].message.content;
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      let keywords = null;
      let topic = null;

      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          keywords = parsed.keywords;
          topic = parsed.topic;
        } catch(parseError) {
        }
      }

      if (keywords && Array.isArray(keywords) && keywords.length > 0) {
        return keywords.slice(0, 3).join(' ') + ' 2025';
      }

      if (topic) {
        const words = topic.split(' ').slice(0, 5);
        return words.join(' ') + ' 2025';
      }

      const keywordsMatch = cleanContent.match(/"keywords"\s*:\s*\[([^\]]+)\]/);
      if (keywordsMatch) {
        try {
          const keywordsList = JSON.parse('[' + keywordsMatch[1] + ']');
          return keywordsList.slice(0, 3).join(' ') + ' 2025';
        } catch(e) {
        }
      }

    } catch(e) {
    }

    return "iptv streaming setup guide 2025";
  })()
}}
```

---

## Node 3: "Deep Research"

### System Message Content:
```
You are an expert IPTV and streaming technology researcher. Provide comprehensive, practical insights focused on setup guides, troubleshooting solutions, and device compatibility. Include specific app versions, device requirements, and step-by-step solutions.
```

### User Message Content:
```
Research: {{ $json.topic }}
Category: {{ $json.category }}
Angle: {{ $json.angle }}

Provide comprehensive research including:
1. Step-by-step setup/troubleshooting instructions
2. Device compatibility and requirements
3. App versions and update information
4. Common problems and their solutions
5. Alternative methods or workarounds
6. Performance optimization tips
7. Related features users should know
8. FAQ-worthy questions users commonly ask

Focus on {{ $json.searchQuery }}

Be specific with app names, version numbers, device models, and exact steps. Avoid generic statements.
```

---

## Node 4: "AI Content Generation using GPT5-mini"

### System Message Content:
```
You are an expert IPTV and streaming technology writer. Your task is to write COMPLETE, COMPREHENSIVE technical guides of EXACTLY 2000-2500 words. Focus on practical, step-by-step instructions. DO NOT truncate content. Write EVERY section in FULL DETAIL. Include specific app names, settings, and troubleshooting steps.
```

### User Message Content:
```
Topic: {{ $('Set Topic Data').item.json.topic }}
Category: {{ $('Set Topic Data').item.json.category }}
Angle: {{ $('Set Topic Data').item.json.angle }}
Keywords: {{ $('Set Topic Data').item.json.keywords.join(', ') }}

Research: {{ $('Deep Research').item.json.choices[0].message.content }}

Write a COMPLETE 2000-2500 word technical guide about "{{ $('Set Topic Data').item.json.topic }}"

REQUIREMENTS:
1. Use the specific angle: {{ $('Set Topic Data').item.json.angle }}
2. Target users looking for {{ $('Set Topic Data').item.json.category }} help
3. Include ALL research data provided
4. Write in a helpful, clear technical tone
5. Use markdown formatting with proper headers
6. Include specific steps, settings, and solutions

STRUCTURE:
# [Clear, SEO-Optimized Title with Year]
## Quick Answer (50-100 words summary)
## Introduction (200+ words)
## Prerequisites/Requirements (150+ words)
## Step-by-Step Guide (600+ words with numbered steps)
## Troubleshooting Common Issues (400+ words)
## Pro Tips and Optimization (300+ words)
## Frequently Asked Questions (300+ words - 4-5 questions)
## Conclusion (150+ words)

Write the FULL article now. Do not use placeholders. Include specific app names, menu paths, and settings.
```

---

## Node 5: "Format Blog JSON"

Replace the entire Code node with this JavaScript:

```javascript
// Get content and metadata
const aiResponse = $('AI Content Generation using GPT5-mini').item.json;
const aiContent = aiResponse.message?.content || aiResponse.choices?.[0]?.message?.content || '';
const topic = $('Set Topic Data').item.json.topic;
const category = $('Set Topic Data').item.json.category;
const keywords = $('Set Topic Data').item.json.keywords || [];

// Validate content
const wordCount = aiContent.split(/\s+/).filter(word => word.length > 0).length;
if (wordCount < 1800) {
  throw new Error(`Content too short: ${wordCount} words. Minimum 1800 required.`);
}

// Generate slug from topic
const slug = topic
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .substring(0, 60) + '-' + Date.now();

// Extract title
const titleMatch = aiContent.match(/^#\s+(.+)$/m);
const title = titleMatch ? titleMatch[1].replace(/[*_`]/g, '') : topic;

// Get first paragraph for description
const firstParagraph = aiContent
  .split('\n\n')
  .find(p => p.trim() && !p.startsWith('#'));
const description = firstParagraph ?
  firstParagraph.substring(0, 160).replace(/[*_`#]/g, '') :
  `Comprehensive guide on ${topic}`;

// Create JSON file content with CORRECT STRUCTURE for iptv-web
const blogData = {
  slug: slug,
  title: title,
  description: description,
  content: aiContent,
  category: category,
  keywords: keywords,
  tags: keywords.slice(0, 5),
  publishedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  author: {
    name: "IPTV Guide Team",
    bio: "Expert IPTV enthusiasts helping you get the most out of streaming technology",
    expertise: "IPTV & Streaming Expert"
  },
  metrics: {
    readingTime: Math.ceil(wordCount / 225),
    wordCount: wordCount
  }
};

const jsonContent = JSON.stringify(blogData, null, 2);

return {
  jsonContent: jsonContent,
  filePath: `public/blog-data/${slug}.json`,
  commitMessage: `Add blog post: ${title}`,
  slug: slug,
  wordCount: wordCount
};
```

---

## Node 6: "Create File in GitHub"

Update these settings in the GitHub node:

| Setting | New Value |
|---------|-----------|
| **Owner** | `notsurewhoisthis` |
| **Repository** | `iptv-web` |
| **File Path** | `={{ $json.filePath }}` (keep as is) |
| **File Content** | `={{ $json.jsonContent }}` (keep as is) |
| **Commit Message** | `={{$json.commitMessage}}` (keep as is) |

---

## Summary Checklist

- [ ] Node 1: Updated topics array and prompts
- [ ] Node 2: Updated all 5 assignment fallback values
- [ ] Node 3: Updated system and user prompts for IPTV research
- [ ] Node 4: Updated system and user prompts for IPTV content generation
- [ ] Node 5: Updated author info with `expertise` field
- [ ] Node 6: Changed repository from `lookatmyprofile-web` to `iptv-web`
- [ ] Heroku: Auto-deploy enabled from GitHub

---

## Deployment Pipeline

```
n8n Schedule (24h)
       ↓
Perplexity: Generate IPTV topic
       ↓
Perplexity: Deep research
       ↓
OpenAI: Write 2000+ word article
       ↓
Format JSON for iptv-web schema
       ↓
GitHub: Create file in public/blog-data/{slug}.json
       ↓
Heroku: Auto-deploy triggered
       ↓
Blog post live at /blog/{slug}
```
