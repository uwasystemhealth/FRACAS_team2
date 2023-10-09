# Material UI - Next.js App Router example in TypeScript
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

This is a [Next.js](https://nextjs.org/) project bootstrapped using [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with Material UI installed.

## How to use

Download the example [or clone the repo](https://github.com/mui/material-ui):

<!-- #default-branch-switch -->

```bash
curl https://codeload.github.com/mui/material-ui/tar.gz/master | tar -xz --strip=2  material-ui-master/examples/material-ui-nextjs-ts
cd material-ui-nextjs-ts
```

Install dependencies and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This example uses [`next/font/google`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts#google-fonts) to automatically optimize and load Roboto, a custom Google Font.

## Learn more

To learn more about this example:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Customizing Material UI](https://mui.com/material-ui/customization/how-to-customize/) - approaches to customizing Material UI.
