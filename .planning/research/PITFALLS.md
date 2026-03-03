# Domain Pitfalls: Developer Portfolio Projects

**Domain:** Frontend Developer Portfolio (modern & polished, AI-forward positioning)
**Researched:** 2026-03-03
**Confidence:** HIGH (validated across recruiter feedback, hiring manager research, 2026 portfolio guides)

---

## Critical Pitfalls

Mistakes that cause hiring managers to immediately skip your profile or that trigger deal-breaker perceptions.

### Pitfall 1: Generic, Undifferentiated Project Selection

**What goes wrong:** Your portfolio looks identical to hundreds of others—same layout, same projects (todo app, weather app, calculator clone), same "About Me" template. Hiring managers skim for 3-5 seconds, see nothing unique, and mentally file you as "generic junior developer." You vanish into a "giant blob of React-powered sameness."

**Why it happens:**
- Using tutorial projects as primary portfolio work without modification
- Following generic portfolio templates without customization
- Cloning popular apps (Netflix clone, Spotify clone, Twitter clone) without adding original value
- Including every project you've ever built rather than ruthlessly curating
- Not thinking about what makes *your* work unique or interesting

**Consequences:**
- Hiring managers categorize you as "follows tutorials, no independent thinking"
- Portfolio provides zero signal of creative problem-solving or unique perspective
- Credibility collapse when they see cloned projects are unmodified from originals
- Immediate loss to candidates with differentiated work
- Missed opportunity to stand out in crowded field

**Prevention:**
- **Ruthless curation:** 3-5 *best* projects beat 20 weak ones. Quality over quantity.
- **Originality requirement:** For tutorial projects, explicitly document what you added/modified beyond the original ("Added X feature," "Refactored backend to Y," "Deployed on Z infrastructure")
- **Unique projects:** Showcase projects that solve *your* problems or demonstrate *your* interests (especially AI-related if that's your brand)
- **Distinctive design:** Make portfolio design and navigation feel intentional and custom, not templated
- **Template customization:** If using templates, heavily customize—don't ship stock designs

**Detection:**
- Ask: "Would a hiring manager recognize this as *my* work or generic boilerplate?"
- Ask: "Does each project demonstrate something unique about how I think or what I'm passionate about?"
- Compare against 5-10 other portfolios—if you see identical layouts/projects, you're in the blob
- Can you articulate what makes each project distinctly yours in 1-2 sentences?

**Phase mapping:** Foundational (Phase 1) — this determines your entire brand positioning

---

### Pitfall 2: Broken Projects, Dead Links, and Unmaintained Code

**What goes wrong:** Project links point to dead Heroku apps (Heroku shut down free tier in 2022), GitHub repos show "last commit 2 years ago" with dozens of deprecated dependencies, project README is outdated. Hiring manager clicks "view project" → 404. Trust evaporates instantly.

**Why it happens:**
- Heroku free tier shutdown forced migration but projects weren't re-hosted
- Created portfolio projects, forgot they exist, never updated dependencies
- GitHub profiles show last activity was years ago—implies you're not actively building
- Assumption: "it worked once, so portfolio is done" without ongoing maintenance

**Consequences:**
- Instant credibility damage—hiring managers interpret broken links as carelessness
- Signals: "I don't understand maintenance," "I don't care about this work," "If you won't maintain your own code, why should we trust you with ours?"
- Takes you completely out of running before technical evaluation even begins
- Particularly damaging if you're claiming to be "modern & polished"

**Prevention:**
- **Every link must be live:** Test every single project link before shipping
- **Re-host dead projects:** Use free tier alternatives (Vercel, Netlify, Railway, Render) to keep projects accessible
- **Maintenance signals:** Add "Last Updated" dates to projects; show you actively maintain them
- **Quarterly updates:** Make small, visible updates quarterly: fix bugs, update dependencies, refresh documentation
- **Security scanning:** Use GitHub's Dependabot or Snyk to catch and fix vulnerability alerts
- **Archive strategy:** Archive or remove projects you won't maintain rather than leaving dead links

**Detection checklist:**
- Click every link in your portfolio—does it load? Does it work? Any 404s or timeouts?
- Run `npm audit` on every project repo—critical vulnerabilities?
- Check GitHub for last commit date—is each project within 6 months of "alive"?
- Is there evidence the projects are being maintained (recent fixes, dependency updates)?

**Phase mapping:** QA/Polish (Phase 4) — maintenance discipline is non-negotiable before launch

---

### Pitfall 3: Missing or Vague Technical Explanation

**What goes wrong:** Project descriptions are marketing copy ("Built a modern, cutting-edge app using latest technologies") with zero technical depth. Hiring manager has no idea what *you actually did*, if you contributed or just followed a tutorial. When asked about implementation details, you give vague answers → red flag for borrowed/copied code.

**Why it happens:**
- Confusing "impressive-sounding" with "credible"
- Treating project description as marketing pitch rather than technical specification
- Avoiding technical detail because you're not 100% confident in the explanation
- Never thinking through design decisions deeply enough to articulate them
- Copying project descriptions from tutorials or templates without customization

**Consequences:**
- Hiring managers assume: "Can't explain their own work → didn't build it"
- Technical interview will expose the gap immediately
- "Vague technical explanations" is a recognized recruiter red flag for borrowed/copied code
- Loses all credibility even if project UI quality is high
- Particularly damaging in technical interviews when they ask follow-up questions

**Prevention:**
- **Technical case study format:** For each project, write 2-3 paragraphs explaining:
  - **The problem you solved** (not what the app does, but the *technical challenge* you faced)
  - **Architecture decisions and *why*** you chose them over alternatives ("Used Context API instead of Redux because state was simple enough that Redux was overkill")
  - **Specific implementation details** (which libraries, patterns, custom code, optimizations)
  - **What you learned or would do differently** ("If I rebuilt this today, I'd use X instead of Y because...")
- **Be specific with trade-offs:** "Chose SQLite over PostgreSQL because this learning project needed zero deployment overhead"
- **Document decisions:** Keep clear code comments and commit messages that show your decision-making
- **Practice explaining out loud:** If you can't articulate it smoothly in conversation, the explanation is too vague
- **Be honest about learning:** It's fine to say "I learned technique X from Y tutorial, then customized it to do Z"

**Detection:**
- Read your project description—does it explain *what* you built or *why* and *how*?
- Can you answer "what would you do differently if you built this today?" with specific technical reasoning?
- Could a non-technical person understand the project? Could a technical person?
- Would you feel confident in a technical interview explaining every major decision?

**Phase mapping:** Development (Phase 2-3) — technical clarity is non-negotiable for credibility

---

### Pitfall 4: All Flash, No Substance (Animations Hurting Performance & UX)

**What goes wrong:** Portfolio has elaborate animations, smooth transitions, micro-interactions everywhere. It looks *impressive* for 3 seconds, then users experience lag, jank, scrolling stutters. Bounce rate spikes. Contact form conversions drop 40-50%. What was meant to impress actually drives people away.

**Why it happens:**
- Confusing "technically impressive" with "effective design"
- Wanting to showcase animation/technical skills without considering user impact
- Using unoptimized animations or forcing expensive repaints on every interaction
- Ignoring users who prefer reduced motion (accessibility failure)
- Using animation libraries that aren't GPU-accelerated (poor performance)
- Testing only on high-end devices; not catching jank on slower mobile hardware

**Consequences:**
- Portfolio feels "show-offy" or "gimmicky" rather than professional and polished
- Users bounce before reading your best work
- Slow/janky performance undermines credibility (contradicts "modern & polished" brand)
- Accessibility failure—immediate red flag for thoughtful design sensibility
- High motion distracts from actual portfolio content and projects
- Mobile performance collapse on slower connections/devices

**Prevention:**
- **"Minimal, purposeful motion" principle:** Every animation must serve user needs (guide attention, enhance UX, provide feedback). No decoration.
- **GPU-accelerated only:** Use only CSS `transform` and `opacity` properties (these offload to GPU and maintain 60fps)
- **Avoid expensive operations:** Don't animate `width`, `height`, `left`, `top`, `box-shadow`, or other layout-triggering properties
- **Test on slow devices:** Throttle CPU/network in DevTools; test on actual older mobile hardware
- **Implement `prefers-reduced-motion`:** Respect users who have motion preferences enabled (disability/accessibility)
- **Measure impact:** A/B test with/without animations; check bounce rate, conversion rate, engagement
- **Performance budget:** Establish targets (e.g., <3s load, 60fps animations); measure against them
- **Ask the hard question:** "Does this animation help the user understand or complete a task? Or is it just decoration?"
- **Performance bars:**
  - Load time under 3 seconds (every additional second loses ~7% conversions)
  - 60 FPS animations on baseline mobile hardware (iPhone SE, Moto G)
  - Lighthouse score > 90

**Detection checklist:**
- Open portfolio on slow mobile connection (DevTools 4G throttle)—does it feel sluggish?
- Check DevTools Performance tab—any jank/dropped frames?
- Try with `prefers-reduced-motion: reduce` enabled—does the site break or feel incomplete?
- Show to non-technical user—do they notice animations or focus on content?
- Measure: "Did animations increase or decrease time spent on portfolio?"

**Phase mapping:** Design (Phase 1) for planning; Polish (Phase 4) for validation

---

### Pitfall 5: Poor Mobile Responsiveness

**What goes wrong:** Portfolio looks polished on desktop, but on mobile the layout breaks, text is unreadable, navigation is hidden/unusable, or projects are impossible to view. Over 47% of web traffic is mobile—hiring managers check portfolios on their phones between meetings. Broken mobile = invisible to half your traffic.

**Why it happens:**
- Desktop-first design approach; "adding mobile" as afterthought
- False assumption: "Hiring managers only view portfolios at their desks"
- Testing only on personal device (one specific screen size); not testing full range
- Navigation structure doesn't adapt to mobile constraints
- Underestimating mobile traffic importance

**Consequences:**
- Invisible to 47%+ of your traffic (mobile visitors bounce immediately)
- Hiring manager sees broken layout on phone → assumes you don't understand responsive design or don't test on mobile
- Recruiting platforms (LinkedIn, email) often access on mobile; portfolio looks broken on first impression
- Red flag: "Doesn't understand responsive design" or "Doesn't test across devices"
- Particularly damaging for "modern & polished" brand

**Prevention:**
- **Mobile-first design:** Start with mobile constraints, then enhance for larger screens
- **Comprehensive testing:**
  - Test on real mobile devices (not just browser DevTools)
  - Test at all breakpoints: 320px, 375px, 768px, 1024px, 1440px
  - Use both portrait and landscape orientations
  - Test on 4G connections (slow network speeds)
- **Touch-friendly design:**
  - Interactive elements must be 44x44px minimum (Apple HIG standard)
  - Adequate spacing between buttons (no accidental taps)
  - Tap targets shouldn't overlap
- **Mobile-specific UX:**
  - Hamburger menus are fine, but must be discoverable and functional
  - Touch-friendly form inputs (adequate size, spacing)
  - Ensure projects are visible and usable on small screens (may need different layouts)
  - Test scrolling smoothness; avoid jank
- **Performance on mobile:**
  - Check page speed on 4G throttling—should load in <3 seconds
  - Avoid heavy JavaScript that makes mobile browsers slow

**Detection checklist:**
- Open portfolio on your phone—does layout look intentional or broken?
- Chrome DevTools responsive mode at 375px width—does everything work?
- Navigate and interact on mobile—can you use every feature on touch?
- Try hamburger menu on mobile—is it discoverable and usable?
- Load on slow 4G—does it load in <3 seconds?
- Ask: "Would I be proud to have a hiring manager first see my work on this mobile layout?"

**Phase mapping:** Development (Phase 2-3), with final validation in QA (Phase 4)

---

### Pitfall 6: Unclear Information Architecture and Navigation

**What goes wrong:** Visitors can't figure out how to navigate your portfolio. Where are projects? Where's contact info? Is there more content below? Navigation is confusing, unclear, or non-standard. Users give up and bounce before reaching your best work.

**Why it happens:**
- Trying to show everything on one page without clear sections
- Navigation menu is unclear, too creative, or non-standard
- Information hierarchy doesn't guide attention to important content
- Missing clear calls-to-action or entry points
- Not testing with real users

**Consequences:**
- High bounce rate—visitors leave without viewing your projects
- Hiring managers miss your best work entirely
- Portfolio feels amateurish or disorganized
- Signals poor UX/information design skills (particularly damaging if UX is part of your job)

**Prevention:**
- **Clear semantic structure:** Hero (intro + CTA) → About (who you are) → Projects (best 3-5) → Contact
- **Navigation principles:**
  - Always accessible and clearly labeled
  - Standard patterns (don't be too clever—hiring managers evaluate many portfolios and prefer conventions)
  - Answered immediately: "What can I do here?"
  - Contact information visible on every page (footer, persistent header, or dedicated section)
- **Visual hierarchy:** Guide attention to best work first; important sections before less important
- **Avoid overload:** Use clear scrolling sections or navigation; don't dump everything above the fold
- **User testing:** Have 3-5 fresh users (non-technical is fine) navigate; watch where they hesitate, get confused, or click wrong
- **Mobile-specific:** Test hamburger menu, touch targets, scroll behavior on mobile

**Detection checklist:**
- Close your eyes, open portfolio, then quickly ask: "Where are the projects? How do I contact this person?"
- Have a non-technical person navigate it—where do they get confused?
- Does the first 10 seconds orient the visitor or confuse them?
- Can you find contact info within 5 seconds?
- Do projects feel like the main focus or buried?

**Phase mapping:** Design (Phase 1) and Development (Phase 2-3)

---

### Pitfall 7: Lack of Business Impact and Quantifiable Results

**What goes wrong:** Projects list features ("Built with React, Node, MongoDB") with zero mention of what problem they solve or what impact they had. Hiring managers scan for metrics, outcomes, strategic thinking—and find none. No signal of business/product acumen.

**Why it happens:**
- Focusing on technical implementation rather than user/business value
- Learning projects don't have clear metrics (so avoiding the topic)
- Assuming "the code speaks for itself" or "results are obvious"
- Not thinking about portfolio projects as mini-products with measurable value
- Treating portfolio like a resume instead of a narrative

**Consequences:**
- Hiring managers see technical competence but no strategic thinking
- Can't articulate why technology decisions matter beyond "it's the best tool"
- Loses competitive advantage vs. candidates who tie work to outcomes
- Signals lack of product thinking, business sense, or impact awareness
- Particularly damaging for senior roles requiring strategic vision

**Prevention:**
- **Problem-first framing:** For each project, articulate the problem it solves (user pain point or technical challenge)
- **Metrics where possible:** "Reduced load time from 6s to 1.2s (80% improvement)," "Serves 1000+ requests/day," "Improved accessibility score from 65 to 95"
- **Case study structure:** Problem → Approach → Solution → Results → Learnings
- **Show iteration and thinking:** Mention research, iteration, lessons learned, not just final product
- **Learning projects with impact:** "Built task manager with offline-first syncing to explore PWA patterns and understand Service Worker trade-offs"
- **Tie to real needs:** Link projects to actual user problems, not just "learning technology X"

**Detection:**
- Read each project description—does it explain *why* the project matters?
- Can you articulate measurable success for each project?
- Would a non-technical person understand why this project was valuable?
- Does description hint at impact or only at features?

**Phase mapping:** Content Strategy (Phase 1) and Development (Phase 2-3)

---

### Pitfall 8: Outdated or Poorly-Chosen Technology Stack

**What goes wrong:** Featured projects prominently use outdated technologies (jQuery, Angular 1.x, Backbone, Python 2) or trendy-but-wrong choices (using React for a static portfolio site). Hiring managers question your judgment about technology choices and whether you stay current.

**Why it happens:**
- Learning with older tutorials without realizing they're outdated
- Following trends without understanding trade-offs or appropriateness
- Over-engineering simple projects ("everything must use a framework")
- Not researching what real teams are actually using
- Keeping old portfolio projects without updating tech stack

**Consequences:**
- Red flag: "Hasn't kept up with modern development"
- Losing credibility on technical judgment and decision-making
- May indicate "follows tutorials blindly" if tech choices don't match project needs
- Can signal stagnation or lack of engagement with evolving landscape
- Particularly damaging for "modern & polished, AI-forward" brand

**Prevention:**
- **Evaluate for project needs:** Choose technology for *this project's* needs, not general trends
- **Document reasoning:** Explain *why* you chose each tool ("Used Next.js for SSR to improve SEO," not "Next.js is popular")
- **Avoid over-engineering:** Static portfolio doesn't need React; simple projects don't need complex frameworks
- **Stay current, not bleeding-edge:** Technologies should have clear ecosystem support and community adoption
- **Brand alignment:** "Modern & polished, AI-forward" suggests staying current with web standards and AI practices
- **Learn relevant tech:** For target roles, choose tools actually used by companies you want to join

**Detection:**
- For each technology: "Would a team I want to work for use this for this type of project?"
- Are your featured technologies ones used by target companies?
- Can you explain *why* this tech was right for this problem vs. alternatives?
- Is the tech modern enough to signal you stay current?

**Phase mapping:** Architecture (Phase 1) — tech choices are foundational

---

## Moderate Pitfalls

Issues that damage credibility or signal lack of attention to detail.

### Pitfall 9: Typos, Grammar Errors, and Visual Inconsistencies

**What goes wrong:** Portfolio has spelling mistakes, grammatical errors, inconsistent spacing, or misaligned elements. Hiring managers immediately interpret this as carelessness or low standards.

**Why it happens:**
- Shipping without proofreading
- Inconsistent component styling or spacing
- Not using design system or consistent spacing scale
- Fatigue after long development

**Consequences:**
- Immediate perception of carelessness
- Raises doubt about code quality ("If the UI is sloppy, what's the code like?")
- Red flag: attention to detail is missing
- Particularly damaging for design-focused roles

**Prevention:**
- **Proofreading:** Use spell-checker (Grammarly, IDE built-ins) and have someone else review
- **Design consistency:** Use CSS variables for colors, establish spacing scale (8px, 16px, 24px grid)
- **Visual alignment:** Test on multiple devices/browsers; do elements feel intentional?
- **Design tokens:** Maintain clear design system documentation
- **Review phase:** Never ship without multiple full reviews

**Detection:**
- Read all text out loud—do errors stand out?
- Check visual alignment: do elements feel intentional or loose?
- Is spacing consistent across sections?

**Phase mapping:** QA/Polish (Phase 4)

---

### Pitfall 10: No Clear Personal Brand or About Section

**What goes wrong:** "About" section is generic ("I'm a developer who loves coding") with no personality, no signal of what makes you unique. Hiring managers can't understand who you are or why they should care about your specific perspective.

**Why it happens:**
- Treating "About" as resume summary rather than brand positioning
- Fear of showing personality
- Unclear about unique value proposition
- Using template copy that applies to everyone

**Consequences:**
- No differentiation beyond technical skills
- Missing chance to connect on personal level
- Loses signal of passion, curiosity, or specialization
- For "modern & polished, AI-forward" portfolio, this is a critical missed opportunity

**Prevention:**
- **Write authentically:** Show skills, interests, what drives you, your voice/personality
- **Be specific:** Mention particular interests (AI, performance optimization, design systems, etc.)
- **Explain the why:** Why do you care about building? What problems are you excited to solve?
- **Bite-sized:** Keep it 2-3 short paragraphs (digestible and engaging)
- **Human touch:** Include genuine photo if possible (human connection)
- **Brand alignment:** Tie back to portfolio theme (if brand is "AI-forward," mention specific AI interests/projects)

**Detection:**
- Does your About section sound like you, or could it apply to anyone?
- Can a hiring manager explain your value prop after reading it?
- Does it hint at personality, passion, or perspective?

**Phase mapping:** Content Strategy (Phase 1)

---

### Pitfall 11: Treating Portfolio as "Build Once, Forget Forever"

**What goes wrong:** Portfolio is created and left untouched for 6+ months. No new projects, no updated content, no maintenance. Signals that you're not actively growing or building.

**Why it happens:**
- Portfolio feels like chore, not opportunity
- Assuming hiring managers only visit once
- Forgetting portfolio is living representation of your skills and growth

**Consequences:**
- Dated projects suggest you haven't shipped in months
- Missing platform to showcase growth and learning
- Can't point to recent work in interviews
- Loses competitive advantage vs. candidates with active portfolios

**Prevention:**
- **Treat as living document:** Quarterly updates are minimum (add projects, refresh dependencies, update content)
- **Document learning:** Blog posts, case studies, "lessons learned" sections
- **Keep current:** Keep projects in sync with your actual current skills
- **Active maintenance:** Use portfolio as marketing tool during job search, not just finished artifact

**Detection:**
- When was the last project added? Is it recent?
- Do projects feel current or dated?
- Would you be proud to send this link today?

**Phase mapping:** Ongoing maintenance — long-term commitment

---

## Minor Pitfalls

Mistakes that cost credibility but aren't deal-breakers.

### Pitfall 12: No GitHub or Source Code Links

**What goes wrong:** Projects presented as finished products with no way to see the code. Hiring managers can't verify claims or evaluate code quality, practices, or documentation.

**Why it happens:**
- Wanting to hide messy code
- Not thinking about verification importance
- Assuming frontend demo is sufficient

**Consequences:**
- Can't evaluate actual code quality
- Harder to verify you built it
- Misses opportunity to show clean code, documentation, meaningful commits

**Prevention:**
- **Always link GitHub:** Include for every project
- **Good repos:** Clear README, meaningful commits, clean code structure
- **Don't worry about "messy":** Learning projects should look like learning; that's fine
- **Clean before sharing:** Remove secrets, unused code, add clear documentation

**Detection:**
- Does every project have a GitHub link?
- Is the repo public and accessible?
- Does repo support or contradict your project claims?

**Phase mapping:** Development (Phase 2-3)

---

### Pitfall 13: No Contact Information or Clear CTA

**What goes wrong:** Portfolio doesn't make it easy to contact you. Email hidden in footer. No "Get in Touch" button. Links to LinkedIn lead nowhere.

**Why it happens:**
- Assuming contact page is enough
- Forgetting that friction = lost opportunities
- Email not prominently displayed

**Consequences:**
- Recruiter interested but can't easily find your email
- Reduces chance of being contacted
- Signals you're not serious about opportunities

**Prevention:**
- **Prominent placement:** Email and/or contact form in obvious places (header, footer, dedicated section)
- **Clear CTA:** "Get in Touch" button visible above the fold
- **Working links:** Ensure all social links (LinkedIn, GitHub, Twitter) are current
- **Backup option:** Simple contact form as alternative if email feels too exposed

**Detection:**
- Can a recruiter find your email within 10 seconds?
- Are contact methods visible without hunting?

**Phase mapping:** Design (Phase 1) — critical infrastructure

---

## Phase-Specific Warnings

| Phase | Topic | Likely Pitfall | Mitigation |
|-------|-------|---|---|
| **Phase 1: Brand & Design** | Visual differentiation | Generic, templated design that blends in | Custom design direction; avoid unmodified templates |
| **Phase 1: Brand & Design** | Information architecture | Unclear structure, confusing navigation | Test with real users; prioritize clarity over cleverness |
| **Phase 1: Content** | Personal brand | Generic "About" with no personality | Write authentically about what drives you and your perspective |
| **Phase 2-3: Development** | Tech choices | Over-engineered or outdated stack | Document *why* each technology; evaluate for project needs |
| **Phase 2-3: Development** | Project quality | Tutorial clones presented as original | Explicitly document what you added beyond the original |
| **Phase 2-3: Development** | Code visibility | Missing GitHub links or poor documentation | Link all repos; ensure clean README, clear commits |
| **Phase 3: Content & Projects** | Project selection | Too many weak projects dilute best work | Limit to 3-5 best projects; ruthlessly curate |
| **Phase 3: Content & Projects** | Business context | No quantifiable impact or problem narrative | Articulate problem, solution, measurable results |
| **Phase 4: QA & Polish** | Mobile responsiveness | Desktop-only design breaks on phones | Test on real devices; design mobile-first |
| **Phase 4: QA & Polish** | Performance & animations | Heavy animations, slow load times, jank | Measure performance; ensure <3s load, smooth motion, proper reduced-motion support |
| **Phase 4: QA & Polish** | Accessibility | Animations ignore prefers-reduced-motion | Implement motion preferences; test with screen readers |
| **Phase 4: QA & Polish** | Link health | Dead links, broken projects, outdated dependencies | Ensure every link is live; audit vulnerabilities regularly |
| **Phase 4: QA & Polish** | Polish | Typos, grammar errors, visual inconsistencies | Proofread thoroughly; use design system |
| **Post-launch: Ongoing** | Maintenance | Portfolio treated as finished, not updated | Schedule quarterly refreshes; keep projects current |
| **Post-launch: Ongoing** | Relevance | Projects become outdated or irrelevant | Rotate older projects out; archive instead of leaving dead |

---

## Quality Gate Checklist for Launch

Before shipping your portfolio, verify:

- [ ] **Brand:** Portfolio visually distinguishes itself; not a generic template
- [ ] **Projects:** 3-5 best projects, well-curated; each with clear description and live demo
- [ ] **Technical clarity:** Can explain every major decision in each project; no vague descriptions
- [ ] **Mobile:** Portfolio works smoothly on mobile devices (tested on real devices)
- [ ] **Performance:** Lighthouse score >90; load time <3s on 4G; animations at 60fps without jank
- [ ] **Navigation:** Clear IA; can find projects and contact info within 10 seconds
- [ ] **Links:** Every project link is live and functional (tested)
- [ ] **Tech stack:** Technologies appropriate for projects; current enough to signal you stay modern
- [ ] **GitHub:** Every major project linked to clean, well-documented repo
- [ ] **Accessibility:** prefers-reduced-motion respected; color contrast WCAG AA; keyboard navigation works
- [ ] **Polish:** No typos, grammar errors, or visual inconsistencies
- [ ] **Contact:** Email/contact form prominently visible and working
- [ ] **About:** Personal, authentic voice; hints at what drives you and your perspective
- [ ] **AI-forward positioning:** (If part of brand) Portfolio reflects engagement with AI/modern tech

---

## Sources

### Research Synthesis
- [How to Build a Developer Portfolio That Actually Gets You Hired (2026) - DEV Community](https://dev.to/__be2942592/how-to-build-a-developer-portfolio-that-actually-gets-you-hired-2026-6kn)
- [Evaluating developer portfolio: 3 proven methods and 7 red flags - Utkrusht](https://utkrusht.ai/blog/evaluting-developer-portfolio)
- [I Analyzed 100 Tech Lead Portfolios: These 5 Projects Are Red Flags to Recruiters - Medium](https://medium.com/@sohail_saifi/i-analyzed-100-tech-lead-portfolios-these-5-projects-are-red-flags-to-recruiters-04d03303d445)

### Design & UX Portfolio Best Practices
- [7 Design Portfolio Mistakes That Are Costing You Jobs! - IxDF](https://www.interaction-design.org/literature/article/avoid-design-portfolio-mistakes-costing-jobs)
- [UX Portfolio Playbook: What Recruiters Actually Look For in 2026](https://blog.uxfol.io/ux-portfolio-playbook/)
- [8 UX Mistakes To Avoid On Your UX Portfolio Website - Medium](https://sarahdoody.medium.com/8-ux-mistakes-to-avoid-on-your-ux-portfolio-website-4d6dd437cf21)
- [Top 10 Information Architecture (IA) Mistakes - NN/G](https://www.nngroup.com/articles/top-10-ia-mistakes/)

### Portfolio Examples & Inspiration
- [Top 100 Most Creative and Unique Portfolio Websites of 2025 - Muzli Blog](https://muz.li/blog/top-100-most-creative-and-unique-portfolio-websites-of-2025/)
- [22 Best Developer Portfolios (Examples) 2026 - Colorlib](https://colorlib.com/wp/developer-portfolios/)
- [The Indispensable Developer Portfolio in 2026 - DEV Community](https://dev.to/alfredo_aguilac1/the-indispensable-developer-portfolio-in-2026-354n)
- [The Anthology of a Creative Developer: A 2026 Portfolio - DEV Community](https://dev.to/nk2552003/the-anthology-of-a-creative-developer-a-2026-portfolio-56jp)

### Performance & Technical Best Practices
- [Frontend Performance Checklist 2025: Speed Up Your Site - Strapi](https://strapi.io/blog/frontend-performance-checklist)
- [Frontend in 2026 Is Broken — How Smart Developers Fix Performance - Medium](https://mohammadtabishanwar9.medium.com/frontend-in-2026-is-broken-heres-how-smart-developers-fix-performance-complexity-scale-5ebc0e3e5f37)
- [Tips for Improving CSS and JS Animation Performance - KeyCDN](https://www.keycdn.com/blog/animation-performance)
- [CSS / JS Animation Trends 2026: Motion & Micro-Interactions - Web Peak](https://webpeak.org/blog/css-js-animation-trends/)

### Accessibility & Standards
- [prefers-reduced-motion - CSS - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- [Why Your Beautiful Web Animations Are Killing Conversions - Medium](https://medium.com/@R.H_Rizvi/why-your-beautiful-web-animations-are-killing-conversions-and-motion-isnt-the-problem-46f1a791c629)

### Mobile & Responsive Design
- [How Users Navigate a Website: UX Guide (2026) - Parallel HQ](https://www.parallelhq.com/blog/how-users-move-through-information-or-navigate-pages-of-website)
- [6 UX Portfolio Rules That Actually Get You Hired in 2026](https://uxplaybook.org/articles/6-ux-portfolio-rules-get-hired-2026)

### AI & Emerging Tech Pitfalls
- [AI Agents in 2026: The Hype vs. The Reality - DEV Community](https://dev.to/agentq/ai-agents-in-2026-the-hype-vs-the-reality-1pb)
- [Why 95% of AI Projects Fail and How Data Fixes It](https://sranalytics.io/blog/why-95-of-ai-projects-fail/)

