# Ahmed Abdelfatah portfolio

An editable bilingual Next.js portfolio with Arabic RTL support, responsive navigation, project/training detail modals, saved dark/light themes, and a server-side contact form.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. For production, run `npm run build` and `npm start`.

## Enable real contact email

The form posts to `/api/contact` and sends messages through Resend. To enable delivery:

1. Create a Resend account and verify a sending domain.
2. Copy `.env.example` to `.env.local` and set `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` to your real secret and verified sender address. `CONTACT_TO_EMAIL` defaults to the portfolio email in `lib/data.ts`.
3. Restart the Next.js server. For deployment, add the same values as encrypted environment secrets in the hosting provider.

The API key stays on the server. The route validates inputs, checks same-origin requests, limits request size, includes a honeypot, and applies a small in-memory rate limit. The form reports an error instead of claiming a message was sent if the provider is not configured or delivery fails.

## Personalization

- Update profile details in `lib/data.ts`.
- Update English and Arabic UI text in `lib/i18n.ts`.
- The supplied profile PDF is available at `public/Ahmed-Abdelfatah-Sabry-Mohamed-CV.pdf` and is linked from both CV buttons.
- The supplied portrait is stored at `public/images/profile.jpg` and configured in `lib/data.ts`; replace that file to update the photo.
- The light/dark preference is stored in local storage.
- Project cards intentionally describe work categories rather than claiming completed projects.
