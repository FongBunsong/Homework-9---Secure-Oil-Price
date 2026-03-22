# express-middleware-assignment

This project is an Express.js application that secures an oil price API with multiple middleware layers.

## Project Summary

The application includes:

- IP filtering for localhost only
- CORS restriction for the local development origin
- Rate limiting with a limit of 10 requests per minute
- JWT token issuance from username/password and JWT protection for the API route
- Basic Auth and login session protection for the dashboard route

## Setup

Prerequisites:

- Node.js 18 or later
- npm

Steps:

```bash
git clone https://github.com/<your-username>/express-middleware-assignment.git
cd express-middleware-assignment
npm install
cp .env.example .env
npm start
```

The server runs at `http://localhost:3000`.

## Environment Variables

The project uses a local `.env` file. The repository includes `.env.example` as a safe template.

Example values used for testing:

| Variable | Value |
|---|---|
| `JWT_SECRET` | `replace_with_a_long_random_secret` |
| `JWT_EXPIRATION` | `1h` |
| `BASIC_AUTH_USER` | `superadmin` |
| `BASIC_AUTH_PASS` | `bunsong@123` |
| `ALLOWED_ORIGIN` | `http://localhost:3000` |

## Middleware Order

The middleware is applied in this order:

1. IP filtering
2. CORS
3. Rate limiting
4. Route authentication

## Routes

| Method | Route | Protection | Purpose |
|---|---|---|---|
| `POST` | `/api/login` | None | Validates username/password and returns JWT token |
| `GET` | `/api/oil-prices` | JWT Bearer Token | Returns the oil price JSON data |
| `GET` | `/login` | None | Displays the dashboard login form |
| `POST` | `/login` | None | Validates login form and starts dashboard session |
| `GET` | `/dashboard` | Basic Auth or login form session | Displays the dashboard page |
| `GET` | `/logout` | None | Redirects to the logged-out message page |
| `GET` | `/logged-out` | None | Displays the logged-out message page |

## Simple UI Notes

The dashboard and logout pages use a simple layout with basic cards, buttons, and a table. The interface is intentionally minimal so that the focus remains on the middleware and route protection requirements.

## How to Test

Get a JWT token:

```bash
curl -X POST http://localhost:3000/api/login \
     -H "Content-Type: application/json" \
     -d '{"username":"superadmin","password":"bunsong@123"}'
```

API request with a valid JWT Bearer token:

```bash
TOKEN="<paste_token_here>"
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:3000/api/oil-prices
```

API request without a token:

```bash
curl http://localhost:3000/api/oil-prices
```

Dashboard request with Basic Auth:

```bash
curl -u superadmin:bunsong@123 http://localhost:3000/dashboard
```

Dashboard request with incorrect Basic Auth:

```bash
curl -u admin:wrongpassword http://localhost:3000/dashboard
```

Rate limit test:

```bash
for i in $(seq 1 11); do
     curl -s -o /dev/null -w "%{http_code}\n" \
          -H "Authorization: Bearer $TOKEN" \
          http://localhost:3000/api/oil-prices
done
```

Browser test:

- Open `http://localhost:3000/dashboard`
- If not authenticated, you will be redirected to `http://localhost:3000/login`
- Enter username/password in the login form, then submit to access the dashboard
- Use the Logout button to redirect to the logged-out page

Basic Auth test with curl:

```bash
curl -u superadmin:bunsong@123 http://localhost:3000/dashboard
```

## Dependencies

| Package | Purpose |
|---|---|
| `express` | Web framework |
| `cors` | CORS middleware |
| `dotenv` | Loads environment variables from `.env` |
| `express-rate-limit` | Rate limiting |
| `basic-auth` | Parses the Basic Auth header |
