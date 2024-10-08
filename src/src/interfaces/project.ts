import { type Author } from "./author";

export type Project = {
  slug: string;
  title: string;
  date: string;
  author: Author;
  excerpt: string;
  content: string;
  preview?: boolean;
};
