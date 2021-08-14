import { Article } from '@model/articles'

export type ProjectLink = {
  url: string
  type: 'github-repo' | 'other'
}

export type Project = {
  title: string
  tags: string[]
  description: string
  articlesAbout: Article[]
  content: string
  link: ProjectLink | undefined
}
