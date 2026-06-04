# Vyom

Vyom is a Sui-aligned sealed capsule platform for creating time-locked messages that can be shared by link and optionally revealed only by a specific Sui wallet.

The product introduces a simple interaction model:

> Create a capsule, define when it unlocks, choose who can reveal it, and share it.

Vyom focuses on programmable digital capsules: private messages that remain sealed until time and access conditions are satisfied.

## Live Deployment

https://vyom-capsules.netlify.app

## Repository

https://github.com/vaibhav0xq/vyom

## Project Abstract

Vyom lets users create sealed message capsules that unlock under clear rules.

A capsule can be opened after a selected unlock time. Creators can choose simple link-based access or restrict reveal to a specific Sui wallet. Connected Sui wallets also act as Vault identity, allowing users to view capsules they created across browsers and devices.

The current release demonstrates the core product workflow for time-based unlocks, shareable capsule links, Sui wallet-gated reveal, and wallet-owned capsule management.

## Screenshots

### Homepage

![Vyom homepage](./public/assert/homepage.png)

### Capsule Creation

![Create capsule](./public/assert/create.png)

### Wallet-Owned Vault

![Wallet-owned vault](./public/assert/vault.png)

### Demo Capsule

![Demo capsule](./public/assert/demo.png)

## Product Capabilities

### Time-Based Unlock

Each capsule has a scheduled unlock time. Until that time arrives, the message remains sealed and the recipient sees a locked state with countdown information.

After the unlock time passes, the capsule becomes eligible for reveal based on its access mode.

### Shareable Capsule Links

Every capsule generates a direct link. This allows creators to send a capsule to another person without requiring the recipient to use the Vault.

### Link Access

Link access capsules can be revealed by anyone with the capsule link after the unlock time has passed.

This mode is designed for simple future messages, announcements, personal notes, or lightweight capsule sharing.

### Sui Wallet-Gated Reveal

Wallet-gated capsules require the recipient to connect the matching Sui wallet before the message is revealed.

This mode adds wallet identity as an access condition, making the reveal specific to the intended Sui address.

### Wallet-Owned Vault

The Vault is tied to the connected Sui wallet.

Capsules created while a Sui wallet is connected are associated with that wallet and can be viewed from another browser or device by connecting the same wallet.

Capsules created without a connected wallet remain accessible through their shared capsule links, but they are not listed in the wallet-owned Vault.

### Demo Experience

Vyom includes a static demo capsule route so visitors can preview the sealed capsule experience without creating a real capsule.

## Core Workflow

1. The creator writes a message.
2. The creator sets an unlock date and time.
3. The creator chooses an access mode:
   - Link access
   - Wallet gated
4. Vyom creates a sealed capsule.
5. The creator shares the capsule link.
6. The recipient opens the capsule link.
7. The message is revealed only after the required conditions are met.

## Access Model

### Link Access

A link access capsule requires only the capsule link and the unlock time condition.

Once the unlock time has passed, the capsule can be revealed by anyone with the link.

### Wallet Gated

A wallet-gated capsule requires both:

- The unlock time condition
- The matching recipient Sui wallet

If the connected wallet does not match the recipient wallet, the capsule remains sealed.

## Technical Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Mysten dApp Kit for Sui wallet connection
- Server-side route handlers for capsule persistence
- Wallet-based Vault identity

## Project Structure

```txt
app/
  api/
    capsules/
      route.ts
      [id]/
        route.ts
  capsule/
    [id]/
      page.tsx
  create/
    page.tsx
  vault/
    page.tsx
  globals.css
  icon.svg
  layout.tsx
  page.tsx

components/
  vyom/
    CapsuleFlow.tsx
    CapsuleHero.tsx
    ProductSurfaces.tsx
    SuiWalletProvider.tsx
    VyomLogo.tsx
    VyomShell.tsx

hooks/
  useCapsules.ts

lib/
  capsule-access.ts
  capsule-utils.ts
  capsules.ts
  supabase-capsules.ts

public/
  assert/
    homepage.png
    create.png
    vault.png
    demo.png

types/
  capsule.ts
```

## Data Model

Vyom stores capsule records with the fields required for sealed message delivery, scheduled unlocks, wallet-gated reveal, and wallet-owned Vault discovery.

The capsule model includes:

- Capsule ID
- Title
- Message
- Recipient wallet
- Unlock timestamp
- Access type
- Owner wallet
- Creation timestamp

Deployment-specific schema setup is intentionally kept outside the public repository. Service credentials and storage configuration should remain private and server-side.

## Environment Variables

Create a `.env.local` file using `.env.example` as reference.

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Important:

- The service role key must remain server-only.
- Do not expose server credentials through `NEXT_PUBLIC_*` variables.
- Capsule persistence is handled through server-side route handlers.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the app locally:

```txt
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Current Implementation Boundaries

The current release demonstrates the complete capsule workflow, including time unlocks, link sharing, Sui wallet-gated reveal, and wallet-owned Vault discovery.

The following areas are planned for future hardening:

- Client-side encryption
- Signature-based unlock verification
- Stronger cryptographic access enforcement
- File and media capsules
- One-time reveal capsules
- NFT-based access conditions
- Payment-based unlock conditions
- Richer programmable unlock logic

## Security Positioning

Vyom currently provides app-level sealed reveal behavior and wallet-gated access logic.

The project should not be described as fully encrypted or cryptographically enforced in its current release. The long-term direction is to add client-side encryption and wallet-signature-based verification so that capsule contents are protected beyond the interface layer.

## Roadmap

Vyom is designed to evolve into a programmable capsule system for digital content.

Future unlock conditions may include:

- Time
- Wallet identity
- NFT ownership
- Payment
- One-time access
- Custom logic
- Private proofs or attestations

The current release establishes the core user experience and Sui wallet identity foundation.

## Submission Summary

Vyom is a live Sui-aligned capsule product featuring:

- Time-locked message capsules
- Shareable capsule links
- Sui wallet-gated reveal
- Wallet-owned Vault
- Wallet connect and disconnect flow
- Static demo capsule route
- Responsive desktop and mobile interface

## Project Description

Vyom is a sealed capsule platform where users create time-locked messages, share them through direct links, and optionally restrict reveal to a specific Sui wallet. It combines scheduled unlocks, wallet identity, and a Vault experience into a focused consumer product for programmable digital capsules.