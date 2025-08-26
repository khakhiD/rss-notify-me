import { JSONBIN_ACCESS_KEY, JSONBIN_BIN_ID } from '../config';
import { FeedMemory } from '../types';

const BASE_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

export async function readFeedState(): Promise<FeedMemory> {
  try {
    const response = await fetch(BASE_URL, {
      headers: {
        'X-Access-Key': JSONBIN_ACCESS_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`JSONBin API READ 오류: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.record || {};
  } catch (error) {
    console.warn('JSONBin에서 피드 상태를 읽을 수 없습니다. 빈 객체를 반환합니다:', error);
    return {};
  }
}

export async function writeFeedState(state: FeedMemory): Promise<void> {
  try {
    const response = await fetch(BASE_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': JSONBIN_ACCESS_KEY,
      },
      body: JSON.stringify(state),
    });

    if (!response.ok) {
      throw new Error(`JSONBin API WRITE 오류: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    throw new Error(`피드 상태 저장 실패: ${error}`);
  }
}
