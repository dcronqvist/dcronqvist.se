import Container from "@/app/_components/container";
import { HeroPost } from "@/app/_components/hero-post";
import { Intro } from "@/app/_components/intro";
import { MoreStories } from "@/app/_components/more-stories";
import { getAllPosts } from "@/lib/api";
import { Metadata } from "next";
import { Person } from "schema-dts";
import JsonLD from "./_components/jsonld";

export default function Index() {
  const allPosts = getAllPosts();

  const heroPost = allPosts[0];

  const morePosts = allPosts.slice(1);

  return (
    <main>
      <JsonLD<Person> context={{
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Daniel Cronqvist',
        alternateName: 'dcronqvist',
        description: 'Software engineer from Sweden, passionate about programming, game development, and open source.',
        identifier: 'dcronqvist',
        image: 'https://dcronqvist.se/assets/blog/images/og_image.jpg',
      }} />
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

export const metadata: Metadata = {
  title: "dcronqvist blog",
  openGraph: {
    title: "dcronqvist blog",
    type: "website",
    url: `https://dcronqvist.se`,
    description: "Blog by Daniel Cronqvist, a software engineer from Sweden.",
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
    ]
  },
};