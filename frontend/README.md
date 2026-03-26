# PayLink-AI Frontend

This frontend powers the public website, citizen onboarding flow, provider onboarding flow, and the operational dashboards for PayLink-AI / NEMIS.

## Stack

- React 19
- Vite 8
- Tailwind CSS 4
- React Router 7
- Axios
- Framer Motion
- Lucide React
- React Hot Toast

## Key Screens

- Landing page for the NEMIS emergency care platform
- Citizen registration and OTP verification
- Citizen sign-in and support dashboard
- Provider registration and provider portal
- Hospital claim verification dashboard
- Admin operations dashboard

## Development

Install dependencies from the `frontend/` directory:

```bash
npm install
```

Start the Vite dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run lint checks:

```bash
npm run lint
```

## Environment

The frontend expects the API base URL from `VITE_API_URL`.

If it is not set, the app falls back to:

```txt
http://localhost:5000/api
```

## Notes

- Shared auth state lives in `src/context/`
- Reusable UI form patterns live in `src/components/`
- The frontend uses a medical-first visual direction built around calm blues, teals, and green support states
