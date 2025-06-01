import { Metadata } from "next";
import { getAllPosts } from "@/lib/api";
import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { PostPreview } from "../_components/post-preview";
import { PostTags } from "../_components/post-tags";
import { PostsTagFilterable } from "../_components/posts-tag-filterable";
import JsonLD from "../_components/jsonld";
import { ItemList } from "schema-dts";

export default async function PostsPage() {
  const posts = getAllPosts();

  return (
    <main>
      <JsonLD<ItemList> context={{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: posts.map(post => ({
          '@context': 'https://schema.org',
          '@type': 'Article',
          author: {
            '@type': 'Person',
            name: post.author.name,
            url: "https://dcronqvist.se",
            image: "https://dcronqvist.se/assets/blog/images/og_image.jpg",
          },
          dateModified: post.date,
          datePublished: post.date,
          headline: post.title,
          image: "https://dcronqvist.se/assets/blog/images/og_image.jpg",
        })),
        itemListOrder: "Descending",
        numberOfItems: posts.length,
        description: "A collection of posts on various topics including programming, game development, open source, and more.",
      }} />
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
