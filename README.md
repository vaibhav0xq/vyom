# Vyom

Vyom is a cinematic web app for creating sealed digital capsules that unlock at a chosen time.

Users can create a capsule, write a private message, set an unlock date, copy a shareable link, and open the capsule later. Before unlock, the message remains hidden behind a sealed preview and countdown. After unlock, the full message is revealed.

## Current Release

- Create sealed message capsules
- Set a time-based unlock condition
- Copy shareable capsule links
- Open shared capsule links across browsers and devices
- Show locked countdown state
- Reveal the message after unlock
- Preserve message paragraph formatting after unlock
- Use Supabase persistence for deployed shareable links
- Use localStorage as a local development fallback
- Responsive premium cosmic/glass interface

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Supabase
- Server-side Next.js route handlers

## Core Flow

1. Create a capsule at `/create`.
2. Write a private message.
3. Set an unlock date and time.
4. Seal the capsule.
5. Vyom saves the capsule.
6. The app redirects to `/capsule/[id]`.
7. Copy and share the capsule link.
8. Opening the link fetches the capsule by id.
9. If the unlock time is in the future, the capsule stays sealed with a countdown.
10. If the unlock time has passed, the message is revealed.

## Environment Variables

Vyom works locally without Supabase by falling back to `localStorage`.

For deployed shareable links that work across devices, configure Supabase:

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Create a `.env.local` file from `.env.example` and fill in the values.

`SUPABASE_SERVICE_ROLE_KEY` must remain server-side only. Do not expose it as a `NEXT_PUBLIC_*` variable.

## Supabase Setup

Run the SQL in:

```text
supabase/schema.sql
```

This creates the `capsules` table used by the API routes.

If your Supabase project requires explicit table permissions, run:

```sql
grant usage on schema public to service_role;
grant select, insert, update, delete on table public.capsules to service_role;
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Validation

Before deploying, run:

```bash
npm run lint
npm run build
```

## Deployment

Vyom can be deployed on Vercel or any Next.js-compatible hosting provider.

Before deployment:

1. Create a Supabase project.
2. Run `supabase/schema.sql`.
3. Add the required environment variables in your hosting provider.
4. Deploy the app.
5. Test the full live flow across devices.

Recommended deployment test:

```text
Create capsule → Copy link → Open link in another browser/device → Wait for unlock → Reveal message
```

## Current Limitations

- Messages are sealed and hidden by app logic, but real cryptographic encryption is not implemented yet.
- Without Supabase, shareable links only work in the same browser because data is stored in `localStorage`.
- With Supabase configured, `/capsule/[id]` links can be opened across browsers and devices.
- Vault is local-device scoped until authentication is added.
- Wallet gating, NFT gating, payments, file capsules, and advanced unlock logic are future features.

## Product Direction

Vyom is designed to evolve into a system for programmable sealed capsules.

Future unlock conditions may include:

- Wallet-based access
- NFT ownership
- Payment-based unlock
- One-time access
- Self-destructing capsules
- Private proofs or credentials
- Custom unlock logic

## License

No license has been specified yet.