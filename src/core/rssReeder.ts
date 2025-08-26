import Parser from 'rss-parser';
import { MAX_LINKS } from '../config';
import { FeedMemory, RSSItem } from '../types';
import { readFeedState, writeFeedState } from '../utils/jsonbin';
import { logger } from '../utils/logger';

const parser = new Parser();

/**
 * RSS 피드에서 새로운 아이템들을 가져와서 메모리에 저장된 상태와 비교
 * 새로운 콘텐츠가 있으면 알림용 아이템 목록에 추가하고, 모든 피드의 상태를 업데이트
 */
export async function fetchNewItems(feedUrls: string[]): Promise<RSSItem[]> {
  // JSONBin에서 저장된 피드 상태 로드
  const memory: FeedMemory = await readFeedState();
  const allNewItems: RSSItem[] = [];

  for (const feedUrl of feedUrls) {
    try {
      const feed = await parser.parseURL(feedUrl);
      const saved = memory[feedUrl] ?? { links: [], lastChecked: 0 };
      const recentLinks = saved.links;
      const lastChecked = saved.lastChecked;

      // 새 아이템 필터링: 발행일이 마지막 확인 시간보다 늦고, 기존 링크에 없는 것만
      const newItems = (feed.items as RSSItem[])
        .filter((item) => {
          if (!item.link || !item.pubDate) return false;
          const published = new Date(item.pubDate).getTime();
          return published > lastChecked && !recentLinks.includes(item.link);
        })
        .map((item) => ({
          ...item,
          source: feed.title || feedUrl,
        }));

      if (newItems.length > 0) {
        // 새 아이템이 있으면 링크 목록에 추가하고 최대 개수 제한
        const newLinks = newItems.map((i) => i.link);
        const merged = [...newLinks, ...recentLinks].filter((v, i, arr) => arr.indexOf(v) === i);
        memory[feedUrl] = {
          links: merged.slice(0, MAX_LINKS),
          lastChecked: Date.now(),
        };
        allNewItems.push(...newItems);
      } else {
        // 새 아이템이 없어도 마지막 확인 시간은 업데이트
        memory[feedUrl] = {
          ...saved,
          lastChecked: Date.now(),
        };
      }
    } catch (err) {
      logger.error(`${feedUrl} 읽기 실패`, err);
    }
  }

  // 모든 피드 처리 완료 후 JSONBin에 상태 저장
  await writeFeedState(memory);
  return allNewItems;
}
