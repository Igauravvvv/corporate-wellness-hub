# Current application functionality

The active `next-app/` application has been migrated to Supabase Auth and Postgres for Vercel deployment. The old browser-only profile store, in-memory actor, sample discussions, fake provider directory, and simulated contact submissions have been replaced.

See [the deployment and operations guide](next-app/DEPLOYMENT.md) for the supported workflows, migration order, environment variables, testing instructions and remaining external integrations. Do not follow the historical Internet Identity setup for this app.

The database migrations and application are implemented locally. A live Supabase project, SMTP service and Vercel deployment must still be configured. Automated database tests use embedded Postgres; browser tests use an isolated fixture service. Live email delivery and two-account cross-device behavior must be verified against the configured project.
