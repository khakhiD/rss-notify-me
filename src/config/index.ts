import dotenv from 'dotenv';

dotenv.config();

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

// JSONBin 설정
export const JSONBIN_BIN_ID = requireEnv('JSONBIN_BIN_ID');
export const JSONBIN_ACCESS_KEY = requireEnv('JSONBIN_ACCESS_KEY');

// 최대 링크 수 설정
export const MAX_LINKS = 20;
