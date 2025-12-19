This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📁 Project Structure

```bash
frontend/
├── 
│   ├── app/
│   │   └── global.css
│   │   └── layout.tsx
│   │   └── page.tsx
│   ├── components/
            ── company/
            │   │   └── CompanySummary.tsx
            │   │   └── GainLossChart.tsx
            │   │   └── PositionsTable.tsx
            ── dashboard/
            │   │   └── GainLossChart.tsx
            │   │   └── SnapshotsTable.tsx
            │   │   └── SummaryCard.tsx
            ── layout/
            │   │   └── Footer.tsx
            │   │   └── Navbar.tsx
            │   │   └── PageContainer.tsx
            ── positions/
            │   │   └── DeleteConfirmation.tsx
            │   │   └── PositionFormModal.tsx
            │   │   └── PositionsTable.tsx
            ── transactions/
            │   │   └── TransactionFormModal.tsx
            │   │   └── TransactionsTable.tsx
            ── ui/
            │   │   └── badge.tsx
            │   │   └── Button.tsx
            │   │   └── Card.tsx
            │   │   └── Error.tsx
            │   │   └── Loading.tsx
            │   │   └── Modal.tsx
            │   │   └── Table.tsx
│   ├── lib/
    │   ├── api/
    │   │       └── analytics.ts
    │   │       └── auth.ts
    │   │       └── client.ts
    │   │       └── companies.ts
    │   │       └── positions.ts
    │   │       └── transactions.ts
│   │   └── api.ts
│   │   └── utils.ts
│   ├── pages/
            company/
            │   │   └── companyName.tsx
            transactions/
            │   │   └── positionId.tsx
│   │   └── dashboard.tsx
│   │   └── position.tsx
│   ├── public/
│   ├── store/
│   │   ├── analyticsStore.ts
│   │   ├── authStore.ts
│   │   ├── companiesStore.ts
│   │   └── positionsStore.ts
│   │   └── transactionsStore.ts
│   ├── types/
│   │   ├── api.ts
│   │   ├── common.ts
│   │   ├── entities.ts
│   │   └── helpers.ts
│   │   └── index.ts
├── .env
├── .gitignore
├── README.md
├── package.json
├── tsconfig.json
└── types.d.ts
