# VinylCrate — Local Record Store Inventory

A Single Page Application (SPA) administrator portal and storefront catalog built with React, React Router, and `json-server` for managing classic vinyl pressings and new releases.

## Features

- **Storefront Landing Page (`/`)**: Displays store hours, location, contact details, and quick navigation into the shop catalog and admin portal.
- **Interactive Crate Catalog (`/shop`)**:
  - Real-time search across album titles, artists, and condition descriptions.
  - Multi-select genre/origin crate filtering (`Jazz`, `Rock`, `Hip-Hop`, `Soul`).
  - Responsive 4-column sleeve grid with interactive detail modal for editing (`PATCH`) prices/descriptions or deleting (`DELETE`) records.
- **Administrator Inventory Portal (`/admin`)**:
  - Accessible form built with `useId` and `useRef` focus management.
  - Real-time client-side validation with inline error feedback and `POST` persistence to `db.json`.
- **Custom Hooks & Context**: Global inventory state powered by `InventoryContext` and the custom `useFetchRecords` hook.

## Tech Stack

- **Frontend**: React 18, React Router v6, Vite, CSS3
- **Simulated Backend**: `json-server` (`db.json`)
- **Testing**: Vitest, React Testing Library, `@testing-library/user-event`

## Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone <your-github-repo-url>
   cd vinyl-crate
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the app and API**:
   ```bash
   npm run dev
   ```
   This starts Vite and the API together. Open the local URL printed by Vite.

## Deploying to GitHub Pages

The GitHub Actions workflow publishes the frontend when changes are pushed to `main`, or when run manually from the Actions tab. Set the repository Actions variable `VITE_API_URL` only if you have deployed a separate API:

1. Deploy a JSON-server-compatible API over HTTPS. It must provide `/records` and `/store_info` endpoints and support the `POST`, `PATCH`, and `DELETE` operations used by this app.
2. Set the API's CORS policy to allow `https://leotamei.github.io`.
3. In the repository, open **Settings → Secrets and variables → Actions → Variables** and add `VITE_API_URL` with the API root URL (for example, `https://api.example.com`, without either endpoint suffix). This must be a separate API host: GitHub Pages only hosts static files and does not provide API endpoints.
4. Open **Settings → Pages** and select **GitHub Actions** as the build and deployment source.
5. Push to `main` or run the **Deploy to GitHub Pages** workflow manually. If `VITE_API_URL` is omitted, the site builds in static demo mode using `db.json`; edits are saved only in the visitor's browser and are not shared with other visitors. If the variable is provided, the workflow validates that it is an absolute HTTPS URL before building.

The deployed site URL will be `https://leotamei.github.io/Vinyl-Crate/`. The workflow also publishes a `404.html` fallback so React Router routes continue to load on refresh.

**Public demo warning:** the admin page currently has no authentication. In static demo mode, edits are local to each browser. With a hosted API, anyone who can reach the deployed site can use its create, edit, and delete controls, so configure the API with that public access model in mind. `VITE_API_URL` is embedded in the public frontend bundle; never put credentials or secrets in it. The local development app continues to use `http://localhost:3001` unless `VITE_API_URL` is set in the environment.