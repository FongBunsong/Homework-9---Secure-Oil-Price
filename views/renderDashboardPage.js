function renderDashboardPage(oilPriceData) {
  const updatedAt = new Date(oilPriceData.last_updated).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC'
  });

  const tableRows = oilPriceData.data.map((item) => {
    const changeClass = item.change >= 0 ? 'positive' : 'negative';
    const changeText = `${item.change >= 0 ? '+' : ''}${item.change.toFixed(2)}`;

    return `
      <tr>
        <td>${item.symbol}</td>
        <td>${item.name}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td class="${changeClass}">${changeText}</td>
      </tr>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Oil Price Dashboard</title>
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: linear-gradient(180deg, #e8f3ff 0%, #dff0ff 100%);
      color: #1f2933;
      padding: 24px;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
    }

    .card {
      background-color: #ffffff;
      border: 1px solid #d9e2ec;
      border-radius: 10px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
    }

    .brand {
      margin: 0 0 14px;
      padding: 10px 14px;
      font-size: 1.5rem;
      color: #1f4f82;
      font-weight: bold;
      text-align: center;
      border: 2px solid #7fb7eb;
      border-radius: 8px;
      background: #f4fbff;
    }

    h1 {
      margin: 0 0 10px;
      font-size: 2rem;
      color: #102a43;
    }

    .subtitle {
      margin: 0 0 20px;
      color: #52606d;
      line-height: 1.5;
    }

    .meta {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 24px;
    }

    .meta-box {
      background-color: #f8fafc;
      border: 1px solid #d9e2ec;
      border-radius: 8px;
      padding: 12px;
    }

    .meta-label {
      display: block;
      font-size: 0.8rem;
      color: #7b8794;
      margin-bottom: 6px;
      text-transform: uppercase;
    }

    .meta-value {
      font-weight: bold;
      color: #102a43;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }

    th,
    td {
      padding: 12px 10px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }

    th {
      background-color: #eef2f7;
      color: #334e68;
      font-size: 0.9rem;
    }

    .positive {
      color: #137333;
      font-weight: bold;
    }

    .negative {
      color: #b42318;
      font-weight: bold;
    }

    .actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 12px;
    }

    .button {
      display: inline-block;
      padding: 10px 16px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: bold;
    }

    .button-primary {
      background-color: #0f766e;
      color: #ffffff;
    }

    @media (max-width: 700px) {
      .meta {
        grid-template-columns: 1fr;
      }

      table,
      thead,
      tbody,
      th,
      td,
      tr {
        display: block;
      }

      thead {
        display: none;
      }

      tr {
        border: 1px solid #d9e2ec;
        border-radius: 8px;
        margin-bottom: 12px;
        padding: 8px;
        background-color: #f8fafc;
      }

      td {
        border-bottom: none;
        padding: 6px 4px;
      }
    }
  </style>
</head>
<body>
  <main class="container">
    <section class="card">
      <p class="brand">Bunsong's Petroleum Center</p>
      <h1>Oil Price Dashboard</h1>
      <p class="subtitle">Latest protected market prices.</p>

      <div class="meta">
        <div class="meta-box">
          <span class="meta-label">Market</span>
          <span class="meta-value">${oilPriceData.market}</span>
        </div>
        <div class="meta-box">
          <span class="meta-label">Last Updated</span>
          <span class="meta-value">${updatedAt} UTC</span>
        </div>
        <div class="meta-box">
          <span class="meta-label">Currency</span>
          <span class="meta-value">${oilPriceData.currency}</span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Price</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>

      <div class="actions">
        <a class="button button-primary" href="/logout">Logout</a>
      </div>
    </section>
  </main>
</body>
</html>`;
}

module.exports = renderDashboardPage;
