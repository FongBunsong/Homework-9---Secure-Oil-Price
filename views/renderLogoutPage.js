function renderLogoutPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Logged Out</title>
  <style>
    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      font-family: "Trebuchet MS", "Segoe UI", Arial, sans-serif;
      background:
        radial-gradient(circle at 16% 15%, rgba(128, 180, 255, 0.24), transparent 33%),
        radial-gradient(circle at 85% 18%, rgba(84, 155, 236, 0.2), transparent 40%),
        linear-gradient(180deg, #e6f2ff 0%, #d8ecff 100%);
      color: #1f2933;
      padding: 24px;
      position: relative;
      overflow: hidden;
    }

    body::before,
    body::after {
      content: "";
      position: fixed;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.34);
      z-index: 0;
    }

    body::before {
      width: 220px;
      height: 220px;
      left: -70px;
      bottom: -70px;
    }

    body::after {
      width: 260px;
      height: 260px;
      right: -80px;
      top: -80px;
    }

    .card {
      position: relative;
      z-index: 1;
      width: min(100%, 460px);
      padding: 28px;
      border-radius: 16px;
      background: #ffffff;
      border: 1px solid #c4dbf4;
      box-shadow: 0 16px 35px rgba(33, 79, 124, 0.14);
      text-align: center;
    }

    .brand {
      margin: 0 0 14px;
      padding: 12px 14px;
      font-size: 1.38rem;
      color: #16497a;
      font-weight: bold;
      text-align: center;
      border: 2px solid #8dc0ef;
      border-radius: 10px;
      background: linear-gradient(180deg, #f8fcff 0%, #ecf6ff 100%);
      letter-spacing: 0.01em;
    }

    h1 {
      margin: 0 0 14px;
      font-size: 1.9rem;
      color: #12385e;
    }

    p {
      margin: 0 auto 16px;
      color: #496b8d;
      max-width: 38ch;
      line-height: 1.55;
      font-size: 1rem;
    }

    .panel-row {
      margin: 18px 0;
      padding: 14px;
      border-radius: 10px;
      border: 1px solid #cfe3f7;
      background: #f4faff;
    }

    .panel-row strong {
      display: block;
      margin-bottom: 6px;
      font-size: 1rem;
      color: #254f79;
    }

    .actions {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 10px;
    }

    a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 42px;
      padding: 0 18px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
    }

    .primary {
      color: #ffffff;
      background: linear-gradient(180deg, #2378be 0%, #165d99 100%);
      box-shadow: 0 6px 14px rgba(31, 96, 148, 0.25);
    }

    .status {
      margin-top: 18px;
      font-size: 0.92rem;
      color: #5b7390;
    }
  </style>
</head>
<body>
  <div class="card">
    <p class="brand">Bunsong's Petroleum Center</p>
    <h1>You have been logged out.</h1>
    <p>Session ended.</p>
    <div class="panel-row">
      <strong>Status</strong>
      <span>Please log in again.</span>
    </div>
    <div class="actions">
      <a class="primary" href="/login">Log in again</a>
    </div>
    <p class="status">The dashboard session has been cleared.</p>
  </div>
</body>
</html>`;
}

module.exports = renderLogoutPage;
