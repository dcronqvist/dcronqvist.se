import { PostTags } from "@/app/_components/post-tags";
import { AvailablePostTags, Post, PostTag } from "@/interfaces/post";
import { Project } from "@/interfaces/project";
import { assert } from "console";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const postsDirectory = join(process.cwd(), "_posts");
const projectsDirectory = join(process.cwd(), "_projects");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { ...data, slug: realSlug, content } as Post;
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

export function getAllPostTags(): PostTag[] {
  return AvailablePostTags;
}

export function mapPostTagIdentifierToModel(tagIdentifier: string): PostTag {
  const allAvailableTags = AvailablePostTags;

  assert(
    allAvailableTags.some((tag) => tag.identifier === tagIdentifier),
    `Tag with identifier "${tagIdentifier}" not found in available tags.`
  );

  return allAvailableTags.find((tag) => {
    return tag.identifier === tagIdentifier;
  })!;
}

export function getProjectSlugs() {
  return fs.readdirSync(projectsDirectory);
}

export function getProjectBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(projectsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { ...data, slug: realSlug, content } as Project;
}

export function getAllProjects(): Project[] {
  const slugs = getProjectSlugs();
  const projects = slugs
    .map((slug) => getProjectBySlug(slug))
    // sort projects by date
    .sort((project1, project2) => (project1.date > project2.date ? -1 : 1));
  return projects;
}