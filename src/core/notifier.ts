// src/core/notifier.ts

import nodemailer from 'nodemailer';

const {
  EMAIL_SERVICE,
  EMAIL_USER,
  EMAIL_APP_PASSWORD,
  EMAIL_TO,
} = process.env;

const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_APP_PASSWORD,
  },
});

export async function sendNotificationEmail(items: { title: string; link: string; pubDate?: string; source: string }[]) {
  if (!items.length) return;

  const subjectTitles = items.slice(0, 3).map((item) => item.title).join(', ');
  const subject = `[RNM] 새 콘텐츠 알림 (${items.length}건: ${subjectTitles}...)`;

  const lines = items.map((item, index) => {
    const dateStr = item.pubDate ? new Date(item.pubDate).toLocaleString() : '날짜 없음';
    return [
      `${index + 1}. ${item.title}`,
      `출처: ${item.source}`,
      `📅 ${dateStr}`,
      `🔗 ${item.link}`,
    ].join('\n');
  });

  const body = [
    `📰 총 ${items.length}건의 새로운 콘텐츠가 발견되었습니다!\n`,
    lines.join('\n\n'),
    `\n\n감사합니다. - RSS Notify Me`,
  ].join('\n');

  await transporter.sendMail({
    from: EMAIL_USER,
    to: EMAIL_TO,
    subject,
    text: body,
  });

  console.log(`[메일 전송 완료] ${items.length}개 항목`);
}
