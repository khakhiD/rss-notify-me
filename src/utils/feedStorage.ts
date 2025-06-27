import fs from 'fs/promises';
import path from 'path';

const FEED_FILE = path.resolve(__dirname, '../../../feed.json');
const MAX_LINKS = 20;

export type FeedMemory = {
  [feedUrl: string]: {
    links: string[];
    lastChecked: number;
  };
};

export async function loadFeedMemory(): Promise<FeedMemory> {
  try {
    const raw = await fs.readFile(FEED_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function saveFeedMemory(memory: FeedMemory) {
  await fs.writeFile(FEED_FILE, JSON.stringify(memory, null, 2));
}

export function updateFeedState(
  current: FeedMemory,
  feedUrl: string,
  newLinks: string[]
): FeedMemory {
  const prevLinks = current[feedUrl]?.links ?? [];
  const merged = [...newLinks, ...prevLinks].filter((v, i, arr) => arr.indexOf(v) === i);
  return {
    ...current,
    [feedUrl]: {
      links: merged.slice(0, MAX_LINKS),
      lastChecked: Date.now(),
    },
  };
}
