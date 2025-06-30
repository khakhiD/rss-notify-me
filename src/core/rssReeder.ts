import Parser from 'rss-parser';
import { RSSItem } from '../types';
import { loadFeedMemory, saveFeedMemory, updateFeedState } from '../utils/feedStorage';
import { logger } from '../utils/logger';

const parser = new Parser();

export async function fetchNewItems(feedUrls: string[]): Promise<RSSItem[]> {
  const memory = await loadFeedMemory();
  const allNewItems: RSSItem[] = [];

  for (const feedUrl of feedUrls) {
    try {
      const feed = await parser.parseURL(feedUrl);
      const saved = memory[feedUrl];
      const recentLinks = saved?.links ?? [];
      const lastChecked = saved?.lastChecked ?? 0;

      const newItems = (feed.items as RSSItem[])
        .filter((item) => {
          if (!item.link || !item.pubDate) return false;
          const published = new Date(item.pubDate).getTime();
          return published > lastChecked && !recentLinks.includes(item.link);
        })
        .map((item) => ({
          ...item,
          source: feed.title || feedUrl, // ✅ 블로그 이름
        }));

      if (newItems.length > 0) {
        const newLinks = newItems.map((i) => i.link);
        const updated = updateFeedState(memory, feedUrl, newLinks);
        await saveFeedMemory(updated);
        allNewItems.push(...newItems);
      }
    } catch (err) {
      logger.error(`${feedUrl} 읽기 실패`, err);
    }
  }

  return allNewItems;
}
