function renderLoginPage(errorMessage = '') {
  const errorHtml = errorMessage
    ? `<p class="error-message">${errorMessage}</p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Login</title>
  <style>
    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      font-family: "Trebuchet MS", "Segoe UI", Arial, sans-serif;
      background:
        radial-gradient(circle at 10% 10%, rgba(128, 180, 255, 0.26), transparent 35%),
        radial-gradient(circle at 85% 20%, rgba(84, 155, 236, 0.2), transparent 40%),
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
      background: rgba(255, 255, 255, 0.35);
      filter: blur(2px);
      z-index: 0;
    }

    body::before {
      width: 220px;
      height: 220px;
      bottom: -70px;
      left: -70px;
    }

    body::after {
      width: 280px;
      height: 280px;
      top: -90px;
      right: -90px;
    }

    .card {
      position: relative;
      z-index: 1;
      width: min(100%, 460px);
      background: #ffffff;
      border: 1px solid #c4dbf4;
      border-radius: 16px;
      padding: 28px;
      box-shadow: 0 16px 35px rgba(33, 79, 124, 0.14);
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
      text-align: center;
    }

    form {
      display: grid;
      gap: 13px;
      margin-top: 6px;
    }

    label {
      display: grid;
      gap: 6px;
      font-weight: bold;
      color: #2c567e;
      font-size: 0.95rem;
    }

    input {
      width: 100%;
      padding: 11px 12px;
      border: 1px solid #b5d0ea;
      border-radius: 8px;
      font-size: 1rem;
      background: #f8fbff;
    }

    input:focus {
      outline: 2px solid #9fc8ef;
      border-color: #2f78b8;
    }

    button {
      border: none;
      border-radius: 8px;
      padding: 12px 16px;
      background: linear-gradient(180deg, #2378be 0%, #165d99 100%);
      color: #ffffff;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 6px 14px rgba(31, 96, 148, 0.25);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    button:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 16px rgba(31, 96, 148, 0.28);
    }

    .error-message {
      background: #fef3f2;
      color: #b42318;
      border: 1px solid #fecdca;
      border-radius: 8px;
      padding: 10px 12px;
      margin-bottom: 16px;
      text-align: center;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <main class="card">
    <p class="brand">Bunsong's Petroleum Center</p>
    <h1>Dashboard Login</h1>
    ${errorHtml}
    <form method="POST" action="/login">
      <label>
        Username
        <input type="text" name="username" required>
      </label>
      <label>
        Password
        <input type="password" name="password" required>
      </label>
      <button type="submit">Log In</button>
    </form>
  </main>
</body>
</html>`;
}

module.exports = renderLoginPage;