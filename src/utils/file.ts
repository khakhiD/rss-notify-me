import fs from 'fs/promises';
import { FEED_PATH } from '../config';

export async function readFeedState(): Promise<Record<string, number>> {
  try {
    const raw = await fs.readFile(FEED_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function writeFeedState(state: Record<string, number>) {
  await fs.writeFile(FEED_PATH, JSON.stringify(state, null, 2), 'utf-8');
}