# Wellness Board - AI-Generated Wellness Recommendation App

1. Project Setup & Demo
-----------------------

**Web**: Run the app locally with the following commands:

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000` (or `http://localhost:3001` if port 3000 is in use).

**Demo**
- Landing page with animated blue theme and wellness journey introduction
- Profile creation form with age, gender, and wellness goals selection
- AI-generated wellness tips displayed in an interactive carousel
- Detailed tip view with step-by-step instructions and explanations
- Favorites system with PDF export functionality

2. Problem Understanding
------------------------

**Problem**: Provide personalized, actionable wellness tips tailored to a user's age, gender, and wellness goals using AI-generated recommendations powered by Google Gemini.

**Assumptions**: 
- Users provide basic demographic information for personalization
- AI-generated content is advisory and not medical advice
- Local storage is used for data persistence (profile, tips, favorites)
- Modern browsers with support for CSS animations and backdrop filters
- Users can save favorite tips and export them as PDF documents

3. AI Prompts & Iterations
--------------------------

**AI Integration**: Google Gemini 1.5 Flash for wellness tip generation.

**Initial Prompt Strategy**: 
```
Generate 5 personalized wellness tips for a [age]-year-old [gender] with goals: [goals]. 
Format as JSON with title, shortDescription, icon, category, steps, and longExplanation.
```

**Issues Encountered**:
- Inconsistent emoji icons and tip formatting
- Markdown artifacts in generated content
- Duplicate favorites when tips regenerated

**Refinements Made**:
- Added strict JSON schema requirements for consistent output
- Implemented unique tip ID system (timestamp + sessionId + index)
- Added content cleaning functions to remove markdown artifacts
- Enhanced prompt with specific formatting instructions for steps and explanations

4. Architecture & Code Structure
--------------------------------

**Tech Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui components

**Key Components**:
- `LandingPage.tsx` - Hero section with animated blue theme and feature highlights
- `ProfilePage.tsx` - User onboarding form with age, gender, and goals selection  
- `TipsScreen.tsx` - Main wellness board with carousel of AI-generated tips
- `DetailScreen.tsx` - Detailed tip view with copy-to-clipboard and step-by-step guides
- `FavoritesScreen.tsx` - Saved tips management with PDF export functionality

**State Management**: 
- React Context API (`AppContext.tsx`) for global state
- Local storage utilities (`storage.ts`) for data persistence
- Smart tip ID generation to prevent favorite conflicts across sessions

**AI Service**: 
- `aiService.ts` handles Google Gemini API calls with retry logic
- `pdfExport.ts` generates formatted PDF exports of favorite tips

5. Screenshots / Features
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
