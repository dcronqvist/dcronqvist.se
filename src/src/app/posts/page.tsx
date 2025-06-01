'use server';

import { Metadata } from "next";
import { getAllPosts } from "@/lib/api";
import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { PostPreview } from "../_components/post-preview";
import { PostTags } from "../_components/post-tags";
import { PostsTagFilterable } from "../_components/posts-tag-filterable";

export default async function PostsPage() {
  const posts = getAllPosts();

  return (
    <main>
      <Container>
        <Header url={"/"} />
        <PostsTagFilterable posts={posts} />
      </Container>
    </main>
  );
}


export async function generateMetadata(): Promise<Metadata> {
  const title = `Posts | dcronqvist blog`;

  return {
    title,
    openGraph: {
      title,
      type: "article",
      url: `https://dcronqvist.se/posts`,
      description: "A collection of posts on various topics including programming, game development, open source, and more.",
      images: [
        {
          url: "https://dcronqvist.se/assets/blog/images/og_image.jpg",
          secureUrl: "https://dcronqvist.se/assets/blog/images/og_image.jpg",
          width: 804,
          height: 461,
          alt: "dcronqvist blog",
          type: "image/jpeg"
        }
      ],
      emails: [
        "daniel@dcronqvist.se"
      ],
      authors: ["dcronqvist"]
    },
  };
}
