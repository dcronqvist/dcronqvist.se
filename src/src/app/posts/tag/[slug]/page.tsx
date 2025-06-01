import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getAllPostTags, getPostBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { PostBody } from "@/app/_components/post-body";
import { PostHeader } from "@/app/_components/post-header";
import { Post } from "@/interfaces/post";
import { PostsTagFilterable } from "@/app/_components/posts-tag-filterable";
import JsonLD from "@/app/_components/jsonld";
import { ItemList } from "schema-dts";

export default async function Tag({ params: { slug } }: Params) {
  const postTags = getAllPostTags();
  if (!postTags.some((tag) => tag.identifier === slug)) {
    return notFound();
  }
  
  const posts = getAllPosts().filter((post: Post) => post.tags?.includes(slug));
  const tagDisplayName = postTags.find((tag) => tag.identifier === slug)?.displayName || slug;

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
          keywords: post.keywords || [],
          description: post.excerpt,
        })),
        itemListOrder: "Descending",
        numberOfItems: posts.length,
        description: `A collection of posts tagged with "${tagDisplayName}" on dcronqvist blog.`,
      }} />
      <Container>
        <Header url={"/"} />
        <PostsTagFilterable posts={posts} currentTag={slug} />
      </Container>
    </main>
  );
}

type Params = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params: { slug } }: Params): Promise<Metadata> {
  const title = `${slug} | dcronqvist blog`;
  const postTags = getAllPostTags();
  const tagDisplayName = postTags.find((tag) => tag.identifier === slug)?.displayName || slug;

  return {
    title,
    openGraph: {
      title,
      type: "article",
      url: `https://dcronqvist.se/posts/tag/${slug}`,
      description: `A collection of posts tagged with "${tagDisplayName}" on dcronqvist blog.`,
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

export async function generateStaticParams() {
  const postTags = getAllPostTags();
  return postTags.map((tag) => ({
    slug: tag.identifier
  }));
}
