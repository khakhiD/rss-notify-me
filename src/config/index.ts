import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`환경변수 ${name}가 설정되지 않았습니다.`);
  }

  return value;
}

// Gmail 설정
export const GOOGLE_USER = requireEnv('GOOGLE_USER');
export const GOOGLE_APP_PASSWORD = requireEnv('GOOGLE_APP_PASSWORD');

// 이메일 발신/수신자 설정
export const MAIL_FROM = requireEnv('MAIL_FROM');
export const MAIL_TO = requireEnv('MAIL_TO').split(',').map(email => email.trim());

// RSS 피드 목록 설정
export const RSS_FEED_URLS = requireEnv('RSS_FEED_URLS').split(',').map(url => url.trim());

// 피드 저장 경로, 최대 링크 수 설정
export const FEED_PATH = path.join(__dirname, '..', '..', 'feed.json');
export const MAX_LINKS = 20;
