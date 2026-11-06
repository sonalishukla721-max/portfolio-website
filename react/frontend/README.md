# Portfolio frontend

Responsive React portfolio frontend backed by the Express REST API in `backend`.
Projects are loaded from the API; the admin area supports creating, editing, and
deleting projects with an administrator login.

## Requirements

- Node.js 20.19+ or 22.12+
- The backend running and connected to MongoDB

## Run locally

From this directory:

```sh
npm install
npm run dev
```

By default, the frontend calls `http://localhost:5000/api`. To use another API,
create a `.env` file in this directory and set:

```env
VITE_API_URL=http://localhost:5000/api
```

`VITE_API_URL` must include the `/api` prefix. Restart the Vite server after
changing the environment file.

## Admin project management

Open `/login` and sign in with an administrator account created by the backend.
The admin dashboard lets authorized users create, edit, and delete projects.
Public visitors can browse the project list and detail pages without signing in.

## Verify production build

```sh
npm run build
```
