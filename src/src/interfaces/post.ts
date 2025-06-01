import { type Author } from "./author";

export type PostTag = {
  displayName: string;
  identifier: string;
}

export const AvailablePostTags: PostTag[] = [
  {
    displayName: "C#",
    identifier: "csharp",
  },
  {
    displayName: ".NET",
    identifier: "dotnet",
  },
  {
    displayName: "Programming Languages",
    identifier: "prog-langs",
  },
  {
    displayName: "Game Development",
    identifier: "game-dev",
  }
];

export type Post = {
  slug: string;
  title: string;
  date: string;
  author: Author;
  excerpt: string;
  content: string;
  preview?: boolean;
  previewImage?: string;
  tags?: string[];
  keywords?: string[];
};
