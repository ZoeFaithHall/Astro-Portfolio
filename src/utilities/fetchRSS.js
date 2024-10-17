import RSSParser from "rss-parser";
const parser = new RSSParser();

const feedUrls = [
  "https://rss.app/feeds/t91oZh3xeoqbFLgW.xml",
  "https://rss.app/feeds/tSqTD4f6ifZRUDgM.xml",
  "https://rss.app/feeds/tctENwJv4A6kTvrt.xml",
  "https://rss.app/feeds/ttaNYcLjdXCgo9NH.xml",
];

async function fetchRSS() {
  const feeds = await Promise.all(
    feedUrls.map((url) => fetchWithRetry(url, 3)),
  );
  const articles = feeds
    .flatMap((feed) => (feed ? feed.items.slice(0, 2) : []))
    .map((item) => ({
      author: item.creator || "Unknown Author",
      date: new Date(item.pubDate).toLocaleDateString(),
      title: item.title,
      category: item.categories ? item.categories[0] : "Uncategorized",
      link: item.link,
    }));

  return shuffleArray(articles);
}

async function fetchWithRetry(url, retries) {
  for (let i = 0; i < retries; i++) {
    try {
      const feed = await parser.parseURL(url);
      return feed;
    } catch (error) {
      console.error(`Error fetching RSS feed from ${url}:`, error);
      if (i === retries - 1) {
        console.error(
          `Failed to fetch RSS feed from ${url} after ${retries} attempts.`,
        );
        return null;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
    }
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default fetchRSS;
