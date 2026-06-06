# Vyom

Vyom is a Sui-aligned sealed capsule platform for creating time-locked digital capsules that can be shared by link and optionally revealed only by a specific Sui wallet.

The project combines a clean consumer experience with Sui wallet identity to support controlled capsule reveal flows.

A capsule can be created, sealed until a selected unlock time, shared through a direct link, and revealed only when its access conditions are satisfied.

## Live Deployment

https://vyom-capsules.netlify.app

## Project Page

https://www.deepsurge.xyz/projects/0dae0be7-489c-467f-b27c-c66cd1208d96

## Repository

https://github.com/vaibhav0xq/vyom

## Project Abstract

Vyom introduces a simple access model for sealed digital capsules.

Users can create a capsule, define when it unlocks, choose how it can be revealed, and share it through a direct link. The current release supports link-based reveal, Sui wallet-gated reveal, a wallet-owned Vault, and a minimal Sui Testnet registry package.

The core idea is to make capsules programmable around two conditions:

- **When** the capsule can open
- **Who** is allowed to reveal it

Vyom is currently focused on sealed message capsules, with a roadmap toward stronger cryptographic access enforcement and richer programmable reveal logic.

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

Each capsule has a scheduled unlock timestamp.

Before the unlock time, the capsule remains sealed and displays a locked state. After the unlock time passes, the capsule becomes eligible for reveal based on its configured access mode.

### Shareable Capsule Links

Each capsule has a direct URL that can be shared with another user.

Vault access is not required to open a capsule. Recipients can access a capsule directly through the shared link.

### Link Access

Link access capsules can be revealed by anyone with the capsule link after the unlock time has passed.

This mode is designed for simple future messages, announcements, personal notes, and lightweight capsule sharing.

### Sui Wallet-Gated Reveal

Wallet-gated capsules require the recipient to connect the matching Sui wallet before the capsule content is revealed.

This adds wallet identity as an access condition and allows a creator to restrict reveal to a specific Sui address.

### Wallet-Owned Vault

The Vault is tied to the connected Sui wallet.

Capsules created while a Sui wallet is connected are associated with that wallet and can be viewed again from another browser or device by connecting the same wallet.

Capsules created without a connected wallet remain accessible through their direct shared links, but they are not listed in the wallet-owned Vault.

### Demo Experience

Vyom includes a static demo capsule route so new users can preview the sealed-to-revealed flow before creating a real capsule.

## Core Workflow

1. The creator writes a capsule message.
2. The creator sets an unlock date and time.
3. The creator chooses an access mode:
   - Link access
   - Wallet gated
4. Vyom creates a sealed capsule.
5. The creator shares the capsule link.
6. The recipient opens the capsule link.
7. The capsule reveals only after the required conditions are satisfied.

## Access Model

### Link Access

A link access capsule requires:

- The capsule link
- The unlock time condition

Once the unlock time has passed, anyone with the direct link can reveal the capsule.

### Wallet Gated

A wallet-gated capsule requires:

- The capsule link
- The unlock time condition
- The matching recipient Sui wallet

If the connected wallet does not match the recipient wallet configured for the capsule, the capsule remains sealed.

## Sui Integration

Vyom uses Sui wallet identity as part of its capsule access model.

The current release includes:

- Sui wallet connection through Mysten dApp Kit
- Wallet-gated reveal based on a recipient Sui address
- Wallet-owned Vault discovery based on the connected Sui wallet
- A minimal Sui Testnet registry package used as an on-chain project marker

### Sui Testnet Package

Vyom includes a minimal registry package deployed on Sui Testnet.

```txt
Network: Sui Testnet
Package ID: 0x6824b764de764bfb1d55ec4bc55fb93f4371c7877b696d94258282990991230c
Transaction Digest: J928hnejDaYXgkcRNcYLuC6y4qeYU2Nnmzg9qHfqr9gV
Shared Project Object: 0x7d807eb8e941ec18398167fdef788eeecb8c87a3632772bd72d52124a43ef701
```

The package is intentionally minimal in the current release. It provides an on-chain marker for Vyom while the primary product experience is delivered through the web application and Sui wallet-based access flow.

Future versions can expand this on-chain layer to support stronger registry logic, programmable unlock rules, and cryptographic access verification.

## Key Design Decisions

### Wallet-Owned Vault

The Vault is intentionally tied to the connected Sui wallet rather than browser-local storage.

This makes Vault behavior consistent across browsers and devices. If a user creates a capsule while connected to a Sui wallet, that capsule can be discovered again by connecting the same wallet elsewhere.

### Direct Capsule Links

Vault is not required to open a capsule.

Every capsule has a direct link, so recipients can access capsules through shared URLs. This keeps the sharing flow simple while still allowing wallet-gated reveal when needed.

### Access Modes

Vyom currently supports two access modes:

- **Link access** — reveal is available after unlock to anyone with the capsule link.
- **Wallet gated** — reveal requires the matching recipient Sui wallet after unlock.

### Minimal On-Chain Package

The current Sui Testnet package is a registry marker, not the full capsule storage or unlock engine.

This keeps the current release focused while creating a clear path for future on-chain or hybrid access logic.

## Technical Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Mysten dApp Kit
- Sui Move
- Sui Testnet
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

move/
  vyom_registry/
    Move.toml
    sources/
      vyom_registry.move

public/
  assert/
    homepage.png
    create.png
    vault.png
    demo.png

types/
  capsule.ts
```

## Move Package

Vyom includes a minimal Move package under:

```txt
move/vyom_registry
```

The package creates a shared `Project` object that marks the current Vyom release on Sui Testnet.

### Build Move Package

```bash
cd move/vyom_registry
sui move build
```

### Publish Move Package

```bash
sui client switch --env testnet
sui client publish --gas-budget 100000000
```

The currently deployed Testnet package is:

```txt
0x6824b764de764bfb1d55ec4bc55fb93f4371c7877b696d94258282990991230c
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

## Validation

The current release has been validated with:

```bash
npm run lint
npm run build
```

Core flows tested:

- Homepage loads correctly
- Capsule creation works
- Link access capsules open after unlock
- Wallet-gated capsules require the matching Sui wallet
- Vault shows capsules owned by the connected wallet
- Wallet connect and disconnect flow works
- Demo capsule route loads correctly
- Sui Testnet registry package builds and publishes successfully

## Current Implementation Boundaries

Vyom’s current release is a functional product prototype with a live web application, Sui wallet integration, wallet-gated reveal, wallet-owned Vault, and a minimal Sui Testnet registry package.

The current wallet-gated reveal is implemented at the application layer. This means the interface enforces the reveal flow based on the connected wallet address, but capsule contents are not yet protected by client-side encryption or signature-based cryptographic unlock.

This is an intentional release boundary for the current version. The project demonstrates the capsule workflow, access model, and Sui identity layer before expanding into stronger cryptographic enforcement.

Planned hardening includes:

- Client-side encryption before capsule persistence
- Signature-based unlock verification
- On-chain or hybrid access registries
- Stronger capsule ownership and recovery model
- Media capsules
- One-time reveal capsules
- NFT-based access conditions
- Payment-based unlock conditions
- Richer programmable reveal logic

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

The current release establishes the core user experience, Sui wallet identity foundation, and initial on-chain project marker.

## Submission Summary

Vyom is a live Sui-aligned capsule product featuring:

- Time-locked message capsules
- Shareable capsule links
- Sui wallet-gated reveal
- Wallet-owned Vault
- Wallet connect and disconnect flow
- Static demo capsule route
- Minimal Sui Testnet registry package
- Responsive desktop and mobile interface

## Project Description

Vyom is a sealed capsule platform where users create time-locked digital capsules, share them through direct links, and optionally restrict reveal to a specific Sui wallet. It combines scheduled unlocks, wallet identity, and a Vault experience into a focused consumer product for programmable digital capsules on Sui.