import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { PostBody } from "@/app/_components/post-body";
import { PostHeader } from "@/app/_components/post-header";
import JsonLD from "@/app/_components/jsonld";
import { Article } from "schema-dts";

export default async function Post({ params }: Params) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");

  const defaultImage = "https://dcronqvist.se/assets/blog/images/og_image.jpg";
  const previewImage = post.previewImage
    ? `https://dcronqvist.se${post.previewImage}`
    : defaultImage;

  return (
    <main>
      <JsonLD<Article> context={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        author: {
          '@type': 'Person',
          name: post.author.name,
          url: "https://dcronqvist.se",
          image: "https://dcronqvist.se/assets/blog/authors/dcronqvist.jpg",
        },
        dateModified: post.date,
        datePublished: post.date,
        headline: post.title,
        image: previewImage,
        articleBody: post.content,
        description: post.excerpt,
        keywords: post.keywords || [],
      }} />
      <Container>
        <Header url={"/"} />
        <article className="mb-32">
          <PostHeader
            title={post.title}
            date={post.date}
            author={post.author}
            tags={post.tags}
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

  const defaultOgImage = {
    url: "https://dcronqvist.se/assets/blog/images/og_image.jpg",
    secureUrl: "https://dcronqvist.se/assets/blog/images/og_image.jpg",
    width: 804,
    height: 461,
    alt: "dcronqvist blog",
    type: "image/jpeg"
  };

  const previewImage = post.previewImage
    ? {
      url: `https://dcronqvist.se${post.previewImage}`,
      secureUrl: `https://dcronqvist.se${post.previewImage}`,
      alt: post.title,
      type: `image/${post.previewImage.split('.').pop()}`,
    }
    : defaultOgImage;

  return {
    title,
    description: post.excerpt,
    keywords: post.keywords || [],
    authors: [{ name: post.author.name, url: "https://dcronqvist.se" }],
    openGraph: {
      title,
      type: "article",
      url: `https://dcronqvist.se/posts/${post.slug}`,
      description: post.excerpt,
      images: [previewImage],
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
