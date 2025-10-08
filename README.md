# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/aaf9ca1f-fe68-4e78-b1db-49cb8c0572a5

# WordBloom

WordBloom is a community-driven blog platform built with Vite, React and Supabase. It lets users sign in (email/password or Google), create posts with rich text, and share them.

## Features
- Email/password authentication and Google OAuth (via Supabase)
- Create, edit and view blog posts
- Rich text editor for content
- Tailwind + shadcn-ui based components

## Local development
1. Install dependencies

```powershell
npm install
```

2. Create a `.env` at the project root with your Supabase keys (no surrounding quotes):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLIC_ANON_KEY
# Optional: redirect URL used for OAuth (match this in Supabase)
VITE_REDIRECT_URL=http://localhost:5173/
```

3. Run the dev server

```powershell
npm run dev -- --port 5173
```

4. Open http://localhost:5173 in your browser.

## Deployment
Deploy the project to Vercel, Netlify, or any static host that supports Vite builds. Make sure to add your deployed URL to Supabase Redirect URLs and set the same VITE_SUPABASE_* env vars in your host.

## Notes
- Ensure Google OAuth is configured in both Google Cloud Console (add Supabase callback URL) and Supabase (add the Google client ID/secret).
- The app expects the Supabase project's Redirect URLs to include the final redirect (for local testing add `http://localhost:5173/`).

## License
MIT
- Click on "New codespace" to launch a new Codespace environment.
