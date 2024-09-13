import Container from "@/app/_components/container";
import { HeroPost } from "@/app/_components/hero-post";
import { Intro } from "@/app/_components/intro";
import { MoreStories } from "@/app/_components/more-stories";
import { getAllPosts } from "@/lib/api";
import { Metadata } from "next";

export default function Index() {
  const allPosts = getAllPosts();

  const heroPost = allPosts[0];

  const morePosts = allPosts.slice(1);

  return (
    <main>
      <Container>
        <Intro/>
        <HeroPost
          title={heroPost.title}
          date={heroPost.date}
          author={heroPost.author}
          slug={heroPost.slug}
          excerpt={heroPost.excerpt}
        />
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
      </Container>
    </main>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: "dcronqvist blog",
    openGraph: {
      title: "dcronqvist blog",
      type: "website",
      url: `https://dcronqvist.se`,
      description: "Blog by Daniel Cronqvist, a software engineer from Sweden.",
      siteName: "dcronqvist blog",
      images: [
        {
          url: `https://dcronqvist.se/assets/blog/authors/dcronqvist.jpg`
        }
      ],
      emails: [
        "daniel@dcronqvist.se"
      ]
    },
  };
}