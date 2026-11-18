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
3. **Start the API** in a terminal:
   ```bash
   npm run server
   ```
4. **Start the app** in a second terminal:
   ```bash
   npm run dev
   ```
   Open the local URL printed by Vite. The API must be running on port `3001` for inventory and store details to load.