# Wellness Hub

The production application lives in **next-app/** and targets **Vercel + Supabase**.

Start with [the deployment guide](next-app/DEPLOYMENT.md) for database migrations, email sign-in, environment variables and Vercel settings.

```sh
cd next-app
npm ci
npm run dev
```

The application includes persistent profiles, groups, discussions, private check-ins, activities, tasks, appointment requests, notifications and administrator moderation. The original Caffeine export in `src/` is retained as historical source, not the deployed backend.
