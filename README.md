# Wellness Board - AI-Generated Wellness Recommendation App

1. Project Setup & Demo
-----------------------

**Web**: Run the app locally with the following commands:

```bash
npm install
npm run dev
```
For AI based features please follow the `env.example` and add the your preferred LLM API KEY. 

The app will be available at `http://localhost:3000`

**Demo**
--------
Please visit `https://plum-assignment.vercel.app/` for the live demo.

2. Problem Understanding
------------------------

**Problem**: Provide personalized, actionable wellness tips tailored to a user's age, gender, and wellness goals using AI-generated recommendations.

**Assumptions**: 
- Users provide basic demographic information for personalization
- AI-generated content is advisory and not medical advice
- Local storage of the browser is used for data persistence (profile, tips, favorites)
- Modern browsers with support for CSS animations and backdrop filters
- Users can save favorite tips and export them as PDF documents or copy them to their device's clipboard.

3. AI Prompts & Iterations
--------------------------

**AI Integration**: Google Gemini models with fallback to lower models in case of API over usage.

**Initial Prompt Strategy**: 
```
Generate 5 personalized wellness tips for a [age]-year-old [gender] with goals: [goals]. 
For each tip, provide:
1. A catchy, concise title (max 8 words)
2. A brief description (max 20 words)
3. A relevant emoji icon
4. A category (nutrition, exercise, mental-health, sleep, lifestyle)

Format as JSON array with this structure:
[
  {
    "title": "string",
    "shortDescription": "string",
    "icon": "emoji",
    "category": "string"
  }
]

Make tips actionable, age-appropriate, and goal-specific. Keep them engaging and motivational.
```

**Issues Encountered**:
- Inconsistent emoji icons and tip formatting
- Markdown artifacts in generated content
- Duplicate favorites when tips regenerated

**Refinements Made**:
- Added strict JSON schema requirements for consistent output
- Implemented unique tip ID system (timestamp + sessionId + index)
- Added content cleaning functions using regex to remove markdown artifacts
- Enhanced prompt with specific formatting instructions for steps and explanations

4. Architecture & Code Structure
--------------------------------

**Tech Stack**: Next.js 15 (A react framework), React 19, TypeScript, Tailwind CSS, shadcn/ui components

**Key Components**:
- `LandingPage.tsx` - Hero section with animated blue theme and feature highlights
- `ProfilePage.tsx` - User onboarding form with age, gender, and goals selection 
- `TipsScreen.tsx` - Main wellness board with carousel of AI-generated tips
- `DetailScreen.tsx` - Detailed tip view with copy-to-clipboard and step-by-step guides
- `FavoritesScreen.tsx` - Saved favorite tips management with PDF export functionality

**State Management**: 
- React Context API (`AppContext.tsx`) for global state
- Local storage utilities (`storage.ts`) for data persistence
- Smart tip ID generation to prevent favorite conflicts across sessions

**AI Service**: 
- `aiService.ts` handles Google Gemini API calls with retry logic

5. Screenshots & Features
-------------------------

**Key Features Implemented**:
- **Landing Page**: Animated blue theme with floating stars and gradient backgrounds
- **Profile Creation**: Clean form with custom goals input and predefined wellness categories
- **Wellness Board**: Interactive carousel with 5 personalized AI-generated tips
- **Tip Details**: Expandable view with step-by-step instructions and "why it works" explanations
- **Favorites System**: Heart-based favoriting with persistent storage across sessions
- **PDF Export**: Generate formatted PDF documents of saved favorite tips
- **Theme Support**: Light/dark mode with smooth transitions and consistent blue accent colors
- **Responsive Design**: Mobile-first approach with proper touch interactions

Screenshots (light & dark themes)
--------------------------------

Light theme (public/screenshots/light_theme):

![Landing - Light](/public/screenshots/light_theme/landingpage.png)
*Landing (light theme)*

![Profile - Light](/public/screenshots/light_theme/profile_onboarding.png)
*Profile Onboarding (light theme)*

![Tips - Light](/public/screenshots/light_theme/tips.png)
*Wellness board / tips (light theme)*

![Details - Light](/public/screenshots/light_theme/details.png)
*Detail view (light theme)*

![Favorites - Light](/public/screenshots/light_theme/favourite.png)
*Favorites / saved tips (light theme)*

Dark theme (public/screenshots/dark_theme):

![Landing - Dark](/public/screenshots/dark_theme/landingpage.png)
*Landing (dark theme)*

![Profile -Dark](/public/screenshots/dark_theme/profile_onboarding.png)
*Profile Onboarding (dark theme)*

![Tips - Dark](/public/screenshots/dark_theme/tips.png)
*Wellness board / tips (dark theme)*

![Details - Dark](/public/screenshots/dark_theme/details.png)
*Detail view (dark theme)*

![Image - Dark](/public/screenshots/dark_theme/favorite.png)
*Additional dark theme illustration*

Quick note on reviewing favorites
--------------------------------

Saved favorites can be exported from the Favorites screen using the "Export PDF" button. The export produces a formatted PDF that includes your profile summary and the saved tips — this is the recommended way to review or share your curated favorites offline.

6. Known Issues / Improvements
------------------------------

**Current Limitations**:
- Local storage only - no cloud sync for user data
- Single user profile - no multi-user support
- Basic AI content filtering - could enhance safety checks
- Static tip categories - could be more dynamic based on user behavior

**Future Improvements**:
- Add user authentication and cloud storage
- Implement tip rating system for better personalization  
- Add progress tracking for wellness goals
- Enhance accessibility with better keyboard navigation and screen reader support
- Add social sharing features for favorite tips
- Implement push notifications for daily wellness reminders

7. Bonus Work
-------------

**Extra Polish & Features Added**:
- **Advanced Animations**: Smooth card hover effects, floating stars, and gentle pulse animations
- **Professional UI**: shadcn/ui components with custom blue theme and backdrop blur effects
- **Smart Favorites**: Unique tip IDs prevent conflicts when regenerating tips
- **PDF Export**: Beautiful HTML-to-PDF generation with user profile information
- **Confirmation Dialogs**: User-friendly warnings before clearing favorites
- **Copy-to-Clipboard**: Easy sharing of individual tips with visual feedback
- **Responsive Typography**: Optimized text sizing and spacing for all screen sizes
- **Dark Mode Excellence**: Carefully crafted dark theme with proper contrast ratios

---
