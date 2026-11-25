export default async function handler(req, res) {
  const { symbol } = req.query;
  if (!symbol) {
    return res.status(400).json({ error: "Missing collection symbol" });
  }

  const host = ["api-mainnet", "magiceden", "dev"].join(".");
  const targetUrl = `https://${host}/v2/collections/${encodeURIComponent(symbol.toLowerCase())}/stats`;

  try {
    const response = await fetch(targetUrl, {
      headers: { "Accept": "application/json", "User-Agent": "Mozilla/5.0" }
    });
    if (!response.ok) {
      return res.status(response.status).json({ error: "Collection not found" });
    }
    const data = await response.json();
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch live stats" });
  }
}
