export type RSSItem = {
  title: string;
  link: string;
  pubDate?: string;
  source: string;
};

export type FeedMemory = {
  [feedUrl: string]: {
    links: string[];
    lastChecked: number;
  };
};
