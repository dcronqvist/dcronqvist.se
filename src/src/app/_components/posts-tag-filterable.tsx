'use client';

import { AvailablePostTags, Post } from "@/interfaces/post";
import { ReactNode, useState } from "react";
import { PostTags } from "./post-tags";
import { PostPreview } from "./post-preview";

type Props = {
  posts: Post[];
  currentTag?: string
};

export function PostsTagFilterable({ posts, currentTag }: Props) {
  const allTags = AvailablePostTags;

  return (
    <>
      <div className="max-w-2xl mx-auto">
        <PostTags 
          tags={allTags}
          highlightedTag={currentTag}
        />
      </div>
      <div className="max-w-2xl mx-auto">
        {posts.map((post) => (
        <div className="mb-6" key={post.slug}>
            <PostPreview 
              key={post.slug}
              title={post.title}
              date={post.date}
              slug={post.slug}
              excerpt={post.excerpt}
            />
        </div>
        ))}
      </div>
    </>
  );
}
