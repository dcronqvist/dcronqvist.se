import { Metadata } from "next";
import { getAllProjects } from "@/lib/api";
import Container from "@/app/_components/container";
import { Intro } from "../_components/intro";
import { HeroPost } from "../_components/hero-post";
import { MoreStories } from "../_components/more-stories";

export default async function Projects() {
  const projects = getAllProjects();

  const heroProject = projects[0];

  const moreProjects = projects.slice(1);

  return (
    <main>
      <Container>
        <Intro type={"projects"} />
        <HeroPost
          title={heroProject.title}
          date={heroProject.date}
          author={heroProject.author}
          slug={`/projects/${heroProject.slug}`}
          excerpt={heroProject.excerpt}
        />
        {moreProjects.length > 0 && <MoreStories posts={moreProjects.map(p => {
          return {
            ...p,
            slug: `/projects/${p.slug}`,
          }
        })} />}
      </Container>
    </main>
  );
}

export function generateMetadata(): Metadata {
  const title = `dcronqvist.se projects`;

  return {
    title,
    openGraph: {
      title,
      images: [],
    },
  };
}
