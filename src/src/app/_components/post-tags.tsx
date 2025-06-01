'use client';

import { PostTag } from "@/interfaces/post";
import Link from "next/link";

type Props = {
  tags: PostTag[];
  clickOnTag?: (tag: PostTag) => void;
  highlightedTag?: string;
};

export function PostTags({ tags, clickOnTag, highlightedTag }: Props) {
  const tagCommonStyle = "inline-block text-sm px-3 py-1 rounded-full select-none"
  const tagStyleIfClickable = "cursor-pointer";

  const notHighlightedStyle = "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  const highlightedStyle = "bg-blue-200 dark:bg-blue-600 text-blue-800 dark:text-blue-200";

  const getTagStyle = (tag: string) => {
    return clickOnTag 
      ? `${tagCommonStyle} ${tagStyleIfClickable} ${highlightedTag === tag ? highlightedStyle : notHighlightedStyle}`
      : `${tagCommonStyle} ${highlightedTag === tag ? highlightedStyle : notHighlightedStyle}`;
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag) => (
          <Link href={highlightedTag === tag.identifier
            ? "/posts"
            : `/posts/tag/${tag.identifier}`} key={tag.identifier}
              className={getTagStyle(tag.identifier)}
            >
            <span
              onClick={() => clickOnTag && clickOnTag(tag)}
              >
              {tag.displayName}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
