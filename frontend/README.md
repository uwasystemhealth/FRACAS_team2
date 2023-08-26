# ADDING NEW PACKAGES

Please check license compatibility when installing new packages!

Add any new licenses to the command if they are `GPL-3.0` compatible.

```bash
npx license-checker --exclude 'MIT, ISC, Apache-2.0, BSD-2-Clause, BSD-3-Clause, MPL-2.0, CC-BY-4.0, CC0-1.0, 0BSD, GPL-3.0, Python-2.0'
# NOTE ABOUT Python-2.0 license:
# https://github.com/eslint/eslint/pull/14890
# https://github.com/markdown-it/markdown-it/issues/926
# Only used for development, not in production so should be ok.
```

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
