/**
 * By: Bunsong FONG
 * app.js — Secure Oil Price API
 *
 * Middleware stack (applied in this order):
 *   1. IP Filtering  — Only allow localhost (127.0.0.1 / ::1)
 *   2. CORS          — Restrict origin to local development server
 *   3. Rate Limiting — Max 10 requests per minute
 *   4. Route Auth    — Bearer Token on /api/oil-prices
 *                    — Basic Auth on /dashboard
 */

require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const rateLimit = require('express-rate-limit');
const basicAuth = require('basic-auth');
const jwt = require('jsonwebtoken');
const renderDashboardPage = require('./views/renderDashboardPage');
const renderLoginPage = require('./views/renderLoginPage');
const renderLogoutPage = require('./views/renderLogoutPage');

const app  = express();
const PORT = Number(process.env.PORT) || 3000;
const DASHBOARD_SESSION_COOKIE = 'dashboard_auth';

// =============================================================
// Configuration — credentials & settings
// =============================================================
const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER || 'superadmin';
const BASIC_AUTH_PASS = process.env.BASIC_AUTH_PASS || 'bunsong@123';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || `http://localhost:${PORT}`;
const JWT_SECRET = process.env.JWT_SECRET || 'replace-with-a-long-random-secret';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// =============================================================
// Static Oil Price Data
// =============================================================
const OIL_PRICE_DATA = {
  market: 'Global Energy Exchange',
  last_updated: '2026-03-15T12:55:00Z',
  currency: 'USD',
  data: [
    { symbol: 'WTI',     name: 'West Texas Intermediate', price: 78.45, change:  0.12 },
    { symbol: 'BRENT',   name: 'Brent Crude',             price: 82.30, change: -0.05 },
    { symbol: 'NAT_GAS', name: 'Natural Gas',             price:  2.15, change:  0.02 }
  ]
};

// =============================================================
// Middleware Layer 1: IP Filtering
// Allow only IPv4 loopback (127.0.0.1) and IPv6 loopback (::1).
// Handles the IPv4-mapped IPv6 form ::ffff:127.0.0.1 as well.
// =============================================================
app.use((req, res, next) => {
  const raw       = req.ip || req.socket.remoteAddress || '';
  const clientIP  = raw.replace(/^::ffff:/, ''); // normalise IPv4-mapped IPv6

  if (clientIP === '127.0.0.1' || clientIP === '::1') {
    return next();
  }

  return res.status(403).json({
    error: 'Forbidden: Your IP address is not allowed.'
  });
});

// =============================================================
// Middleware Layer 2: CORS
// Only requests originating from the local dev origin are
// allowed — all others receive a CORS error response.
// =============================================================
app.use(cors({
  origin: ALLOWED_ORIGIN,
  methods: ['GET'],
  allowedHeaders: ['Authorization', 'Content-Type']
}));

// =============================================================
// Middleware Layer 3: Rate Limiting
// Maximum 10 requests per client per 1-minute window.
// =============================================================
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,  // 1 minute
  max: 10,                   // limit each IP to 10 requests per window
  standardHeaders: true,     // send RateLimit-* headers (RFC 6585)
  legacyHeaders: false,      // disable X-RateLimit-* legacy headers
  message: {
    error: 'Too many requests. Please try again after 1 minute.'
  }
});

app.use(limiter);

// =============================================================
// Route-level Middleware: JWT Authentication
// Validates "Authorization: Bearer <token>" for /api/oil-prices.
// Returns 401 when no/malformed token is supplied and 403 when
// token verification fails (expired/invalid signature).
// =============================================================
function requireBearerToken(req, res, next) {
  const authHeader = req.headers['authorization'] || '';

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized: Bearer token required.'
    });
  }

  const token = authHeader.slice(7); // strip "Bearer " prefix

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(403).json({
      error: 'Forbidden: Invalid or expired token.'
    });
  }
}

// =============================================================
// Route-level Middleware: HTTP Basic Authentication
// Validates username / password for /dashboard.
// Browsers are redirected to /login, while direct requests can
// still use Basic Auth credentials.
// =============================================================
function parseCookies(req) {
  const cookieHeader = req.headers.cookie || '';

  // Convert "a=1; b=2" into an object so session cookies are easy to read.
  return cookieHeader.split(';').reduce((cookies, cookie) => {
    const [key, ...valueParts] = cookie.trim().split('=');

    if (!key) {
      return cookies;
    }

    cookies[key] = decodeURIComponent(valueParts.join('='));
    return cookies;
  }, {});
}

function hasValidDashboardSession(req) {
  const cookies = parseCookies(req);
  return cookies[DASHBOARD_SESSION_COOKIE] === 'authenticated';
}

function setDashboardSession(res) {
  // Store a lightweight auth flag for browser dashboard access.
  res.setHeader(
    'Set-Cookie',
    `${DASHBOARD_SESSION_COOKIE}=authenticated; HttpOnly; Path=/; SameSite=Lax`
  );
}

function clearDashboardSession(res) {
  // Expire the same cookie immediately to log out browser sessions.
  res.setHeader(
    'Set-Cookie',
    `${DASHBOARD_SESSION_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`
  );
}

function hasValidBasicCredentials(req) {
  const credentials = basicAuth(req);

  return Boolean(
    credentials &&
    credentials.name === BASIC_AUTH_USER &&
    credentials.pass === BASIC_AUTH_PASS
  );
}

function isBrowserNavigation(req) {
  const secFetchMode = req.headers['sec-fetch-mode'] || '';
  const acceptHeader = req.headers.accept || '';
  const userAgent = req.headers['user-agent'] || '';

  // Treat standard browser page loads as navigations.
  return secFetchMode === 'navigate' || (
    acceptHeader.includes('text/html') && userAgent.includes('Mozilla')
  );
}

function requireDashboardAuth(req, res, next) {
  // Existing authenticated session can access dashboard directly.
  if (hasValidDashboardSession(req)) {
    return next();
  }

  // Browser users go through the login page instead of a raw 401 response.
  if (isBrowserNavigation(req)) {
    return res.redirect('/login');
  }

  // API tools/curl can still authenticate with Basic Auth headers.
  if (hasValidBasicCredentials(req)) {
    return next();
  }

  if (req.headers.authorization) {
    return res.status(401).send('Unauthorized: Invalid Basic Auth credentials.');
  }

  return res.status(401).send('Unauthorized: Basic Auth credentials required.');
}

// =============================================================
// Routes
// =============================================================

/**
 * POST /api/login
 * Accepts username/password and returns a signed JWT.
 */
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({
      error: 'Bad request: username and password are required.'
    });
  }

  if (username !== BASIC_AUTH_USER || password !== BASIC_AUTH_PASS) {
    return res.status(401).json({
      error: 'Invalid credentials.'
    });
  }

  const token = jwt.sign(
    { username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );

  return res.json({ token });
});

/**
 * GET /api/oil-prices
 * Protected by Bearer Token.
 * Returns the static oil price JSON object.
 */
app.get('/api/oil-prices', requireBearerToken, (req, res) => {
  res.json({
    ...OIL_PRICE_DATA,
    requested_by: req.user.username
  });
});

app.get('/login', (req, res) => {
  // Avoid showing login form again when a valid session already exists.
  if (hasValidDashboardSession(req)) {
    return res.redirect('/dashboard');
  }

  return res.send(renderLoginPage());
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // On success, create session cookie and continue to dashboard.
  if (username === BASIC_AUTH_USER && password === BASIC_AUTH_PASS) {
    setDashboardSession(res);
    return res.redirect('/dashboard');
  }

  return res.status(401).send(renderLoginPage('Invalid username or password.'));
});

/**
 * GET /dashboard
 * Protected by the login form session in browsers and by Basic Auth
 * for direct tool-based requests.
 * Serves an HTML page displaying the oil price table.
 */
app.get('/dashboard', requireDashboardAuth, (req, res) => {
  res.send(renderDashboardPage(OIL_PRICE_DATA));
});

/**
 * GET /logout
 * No authentication required.
 * Clears local browser auth-related data and redirects to a
 * logged-out confirmation page.
 */
app.get('/logout', (req, res) => {
  clearDashboardSession(res);
  // Ask supporting browsers to clear cached site data after logout.
  res.set('Clear-Site-Data', '"cache", "cookies", "storage"');
  res.set('Cache-Control', 'no-store');
  return res.redirect('/logged-out');
});

app.get('/logged-out', (req, res) => {
  res.status(200).send(renderLogoutPage());
});


// Start Server
app.listen(PORT, () => {
  console.log(`\nServer running at http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT}/login`);
  console.log(`\nJWT Login    : POST /api/login`);
  console.log(`Token Expires: ${JWT_EXPIRATION}`);
  console.log(`Dashboard    : username="${BASIC_AUTH_USER}"  password="${BASIC_AUTH_PASS}"\n`);
});
