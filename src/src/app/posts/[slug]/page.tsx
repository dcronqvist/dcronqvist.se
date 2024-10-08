import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { PostBody } from "@/app/_components/post-body";
import { PostHeader } from "@/app/_components/post-header";

export default async function Post({ params }: Params) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");

  return (
    <main>
      <Container>
        <Header url={"/"} />
        <article className="mb-32">
          <PostHeader
            title={post.title}
            date={post.date}
            author={post.author}
          />
          <PostBody content={content} />
        </article>
      </Container>
    </main>
  );
}

type Params = {
  params: {
    slug: string;
  };
};

export function generateMetadata({ params }: Params): Metadata {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const title = `${post.title} | dcronqvist blog`;

  return {
    title,
    openGraph: {
      title,
      type: "article",
      url: `https://dcronqvist.se/posts/${post.slug}`,
      description: post.excerpt,
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
      publishedTime: post.date,
      authors: [post.author.name]
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
