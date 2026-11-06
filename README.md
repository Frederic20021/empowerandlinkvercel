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

## Blog and admin

Posts are Markdown files with front matter in `content/blog/`; their images live in `public/images/blog/`. The public pages (`/blog`, `/blog/<slug>`, `/blog/rss.xml`) are built from those files.

The admin is at `/admin` (login at `/admin/login`). Copy `.env.example` to `.env.local` and set:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public origin used for canonical URLs, sitemap and RSS. |
| `ADMIN_PASSWORD` | Admin login password (server-only). |
| `ADMIN_SESSION_SECRET` | 32+ random characters; signs the 8-hour `el_admin` session cookie. |
| `BLOG_STORAGE` | `local` writes straight into `content/blog` and `public/images/blog`; `github` commits through the GitHub Contents API. Defaults to `local` outside production and `github` in production. |
| `GITHUB_TOKEN` | Token with Contents read/write (server-only, `github` mode). |
| `GITHUB_REPO` | `owner/name`, default `Frederic20021/empowerandlinkvercel`. |
| `GITHUB_BRANCH` | Default `main`. |

With `npm run dev` the admin edits the local files directly. On Vercel (`github` mode) each save is a commit, and the redeploy publishes it.
