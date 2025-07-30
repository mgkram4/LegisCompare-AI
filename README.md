# Contest Doge

This project is a Next.js application with a FastAPI backend designed to compare and analyze legislative bills. It leverages large language models (via OpenAI) to provide insights into bills.

## How it works

The backend exposes an API endpoint `/api/compare` that accepts two legislative bills as input. It then performs the following analyses on these bills:

- **Diff Analysis:** Identifies the differences between the two bills.
- **Summary Analysis:** Provides a concise summary of the bills.
- **Stakeholder Analysis:** Determines key stakeholders affected by the bills.
- **Bias Detection:** Identifies potential biases within the bills.
- **Forecast Analysis:** Predicts potential outcomes or impacts of the bills.

The frontend, running on `http://localhost:3000`, interacts with this backend to display the analysis results.

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
# legal-tool
