import { RSS_FEED_URLS } from './config';
import { sendNotificationEmail } from './core/notifier';
import { fetchNewItems } from './core/rssReeder';
import { logger } from './utils/logger';

async function main() {
  try {
    if (!RSS_FEED_URLS.length) {
      logger.warn('[SKIP] RSS 피드가 설정되어 있지 않습니다.');
      return;
    }

    logger.info(`총 ${RSS_FEED_URLS.length}개의 RSS 피드 확인 시작`);

    const newItems = await fetchNewItems(RSS_FEED_URLS);

    if (newItems.length === 0) {
      logger.info('새로운 콘텐츠가 없습니다.');
      return;
    }

    logger.success(`${newItems.length}개의 새 콘텐츠 발견`);
    await sendNotificationEmail(newItems);
  } catch (error) {
    logger.error('실행 중 오류 발생:', error);
  }
}

main();
