export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://api.gorq.ai/v1/news?query=startup funding india investment",
      {
        headers: {
          Authorization: `Bearer ${process.env.GORQ_API_KEY}`
        }
      }
    );

    const data = await response.json();

    // Defensive check
    if (!data.articles) {
      return res.status(200).json([]);
    }

    // Clean + editorial filter
    const posts = data.articles
      .filter(item =>
        item.title &&
        (item.title.toLowerCase().includes("fund") ||
         item.title.toLowerCase().includes("raise"))
      )
      .slice(0, 8)
      .map(item => ({
        title: item.title,
        summary:
          item.description
            ?.replace(/raises|raised/gi, "secured funding to")
            ?.replace(/valuation/gi, "growth milestone") || "",
        url: item.url,
        source: item.source || "News",
        date: new Date(item.published_at).toDateString()
      }));

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.status(200).json(posts);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch startup funding news" });
  }
}


