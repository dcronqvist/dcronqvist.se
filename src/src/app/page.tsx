import Container from "@/app/_components/container";
import { HeroPost } from "@/app/_components/hero-post";
import { Intro } from "@/app/_components/intro";
import { MoreStories } from "@/app/_components/more-stories";
import { getAllPosts } from "@/lib/api";

export default function Index() {
  const allPosts = getAllPosts();

  const heroPost = allPosts[0];

  const morePosts = allPosts.slice(1);

  return (
    <main>
      <Container>
        <Intro type={"blog"}/>
        <HeroPost
          title={heroPost.title}
          date={heroPost.date}
          author={heroPost.author}
          slug={`/posts/${heroPost.slug}`}
          excerpt={heroPost.excerpt}
        />
        {morePosts.length > 0 && <MoreStories posts={morePosts.map(p => {
          return {
            ...p,
            slug: `/posts/${p.slug}`,
          }
        })} />}
      </Container>
    </main>
  );
}
