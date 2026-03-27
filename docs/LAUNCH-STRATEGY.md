# CRA Launch Strategy — Growth Engine

## Goal
Reach **100 GitHub stars** within 30 days, **1,000 stars** within 90 days.

---

## Phase 1: Pre-Launch (Week 0)

### Deliverables
- [ ] Production README with screenshots and demo GIF
- [ ] Chrome Web Store listing (submitted for review)
- [ ] 30-second demo video (screen recording)
- [ ] Social media preview image (1200x630, OG image)

### Prepare Assets
| Asset | Format | Purpose |
|-------|--------|---------|
| Demo GIF | 800x500, <5MB | README hero, social sharing |
| Screenshot: toolbar | PNG | Feature showcase |
| Screenshot: citation panel | PNG | Feature showcase |
| Screenshot: settings | PNG | Trust building |
| Short video | MP4, 30s | Twitter/X, Reddit |
| OG image | 1200x630 PNG | Link previews |

---

## Phase 2: Launch Day (Week 1)

### Platform Strategy

#### Reddit (Highest ROI)
**Target subreddits:**
| Subreddit | Members | Post Angle |
|-----------|---------|------------|
| r/ChatGPT | 5M+ | "I built a tool to stop losing insights in long conversations" |
| r/OpenAI | 1M+ | "Open-source extension that adds a citation clipboard to ChatGPT" |
| r/productivity | 2M+ | "How I stopped re-reading 50-message ChatGPT threads" |
| r/chrome_extensions | 50K+ | "Built a zero-dependency MV3 extension for ChatGPT reading" |
| r/webdev | 1M+ | "Vanilla JS Chrome Extension with zero dependencies — architecture walkthrough" |
| r/programming | 5M+ | "Building a ChatGPT UI layer with MutationObserver and ProseMirror integration" |

**Post format (Reddit-optimized):**
- Title: Problem-driven, not product-driven
- Body: Short pain statement → what it does → GIF/screenshot → link
- Comment: Technical details, architecture decisions
- Reply actively to every comment for 24 hours

#### Twitter/X
**Thread format:**
1. Hook: "ChatGPT gives amazing answers, but finding them again in a 50-message thread? Painful."
2. Problem elaboration (3 tweets)
3. Solution demo (GIF embedded)
4. Technical angle (zero deps, fully auditable, privacy-first)
5. Call to action (GitHub link + star ask)

**Hashtags:** #ChatGPT #ChromeExtension #OpenSource #AI #Productivity

#### Hacker News
**Title options (test multiple days if needed):**
- "Show HN: ChatGPT Reading Assistant — Select, collect, and reuse text from long conversations"
- "Show HN: Zero-dependency Chrome Extension for ChatGPT power readers"

**HN audience cares about:**
- Technical elegance (zero deps, vanilla JS, ~2K lines)
- Privacy (no network calls, fully auditable)
- No vendor lock-in (MIT, no accounts, no server)

#### Product Hunt
- Schedule for a Tuesday or Wednesday launch
- Prepare 5 screenshots + tagline
- Ask 10+ friends to upvote and comment on launch day

---

## Phase 3: Content Strategy (Weeks 2-4)

### Blog Posts / Articles
| Title | Platform | Angle |
|-------|----------|-------|
| "How I built a Chrome Extension in 2,300 lines of Vanilla JS" | Dev.to, Hashnode | Technical deep-dive |
| "ProseMirror Integration: Inserting Text into ContentEditable Editors" | Dev.to | Niche technical |
| "Privacy-First Chrome Extension Design" | Medium | Trust/security angle |
| "MutationObserver Patterns for SPA DOM Tracking" | Dev.to | Technical reference |

### Short Videos (30-60 seconds)
| Title | Platform |
|-------|----------|
| "This extension changed how I read ChatGPT" | Twitter/X, YouTube Shorts, TikTok |
| "Stop losing insights in ChatGPT conversations" | LinkedIn |
| "Zero-dependency Chrome Extension in Vanilla JS" | YouTube (developer audience) |

---

## Phase 4: Community Building (Months 2-3)

### GitHub Engagement
- Respond to every issue within 24 hours
- Label beginner-friendly issues with `good first issue`
- Write detailed PR reviews with context
- Publish a monthly progress update in Discussions

### Partnerships
- Reach out to ChatGPT-related newsletter authors
- Submit to Chrome Extension directories (extensionhero.com, chromeextensionideas.com)
- Contact productivity YouTubers for reviews

---

## Hook Angles (Why People Will Care)

### For End Users
> "You just had a 30-message conversation with ChatGPT. There were 3 brilliant insights buried in there. How do you find them again?"

### For Developers
> "2,300 lines of vanilla JS. Zero dependencies. Zero network calls. Fully auditable. This is what a privacy-first Chrome Extension looks like."

### For Privacy-Conscious Users
> "Most ChatGPT extensions send your data somewhere. This one doesn't. Not to a server, not to analytics. Zero network calls. Verify it yourself."

---

## Metrics to Track

| Metric | Tool | Target (30 days) |
|--------|------|-------------------|
| GitHub stars | GitHub | 100 |
| GitHub forks | GitHub | 15 |
| Chrome Web Store installs | CWS Dashboard | 500 |
| Reddit post upvotes | Reddit | 200+ on best post |
| Twitter impressions | Twitter Analytics | 50K |

---

## Anti-Patterns to Avoid
- Don't spam multiple subreddits on the same day
- Don't use clickbait titles — Reddit will destroy you
- Don't ask for stars directly in the README (badges are fine)
- Don't launch on Friday or weekend
- Don't ignore comments — engagement drives algorithm
