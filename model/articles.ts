export type ReferencedProject = {
  name: string
  link: string
}

export type ArticleAuthor = {
  name: string
  link: string
  email: string
}

export type Article = {
  title: string
  date: string
  author: ArticleAuthor
  tags: string[]
  content: string
  image: string | undefined
  referencedProjects: ReferencedProject[] | undefined
  readingTime: number
  subHeader: string | undefined
}

export const getArticleLink = (article: Article): string => {
  return article.title
    .toLowerCase()
    .replace(/[!',]+/g, '')
    .replace(/[^a-z0-9]+/g, '-')
}
