import { RSS_FEED_URLS } from './config';
import { sendNotificationEmail } from './core/notifier';
import { fetchNewItems } from './core/rssReeder';

async function main() {
  try {
    if (!RSS_FEED_URLS.length) {
      console.log('[SKIP] RSS 피드가 설정되어 있지 않습니다.');
      return;
    }

    console.log(`[INFO] 총 ${RSS_FEED_URLS.length}개의 RSS 피드 확인 시작`);

    const newItems = await fetchNewItems(RSS_FEED_URLS);

    if (newItems.length === 0) {
      console.log('[INFO] 새로운 콘텐츠가 없습니다.');
      return;
    }

    console.log(`[INFO] ${newItems.length}개의 새 콘텐츠 발견`);
    await sendNotificationEmail(newItems);
  } catch (error) {
    console.error('[ERROR] 실행 중 오류 발생:', error);
  }
}

main();
