import RSSParser from "rss-parser";
const parser = new RSSParser();

const feedUrls = [
  "https://rss.app/feeds/t91oZh3xeoqbFLgW.xml",
  "https://rss.app/feeds/tSqTD4f6ifZRUDgM.xml",
  "https://rss.app/feeds/tctENwJv4A6kTvrt.xml",
  "https://rss.app/feeds/ttaNYcLjdXCgo9NH.xml",
];

async function fetchRSS() {
  const feeds = await Promise.all(feedUrls.map((url) => parser.parseURL(url)));
  const articles = feeds
    .flatMap((feed) => feed.items.slice(0, 2))
    .map((item) => ({
      author: item.creator || "Unknown Author",
      date: new Date(item.pubDate).toLocaleDateString(),
      title: item.title,
      category: item.categories ? item.categories[0] : "Uncategorized",
      link: item.link,
    }));

  return shuffleArray(articles);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default fetchRSS;
