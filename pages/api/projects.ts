import fs from 'fs'
import matter from 'gray-matter'
import { Project } from '@model/projects'
import { getAllArticles } from './articles'
import { removeDuplicates } from '@model/utils'

export const getAllProjects = (): { projects: Project[]; tags: string[] } => {
  const projects: Project[] = []
  const projectsDir = './dcronqvist.se-content/projects'

  if (!fs.existsSync(projectsDir)) {
    return {
      projects: [],
      tags: []
    }
  }

  const files = fs.readdirSync(projectsDir)

  const articles = getAllArticles()

  files.forEach((file) => {
    if (file !== 'template.md') {
      const filePath = `${projectsDir}/${file}`
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const project = matter(fileContent)

      const articlesAbout = articles.articles.filter((article) => {
        return article.referencedProjects
          .map((proj) => proj.name)
          .includes(project.data.title)
      })

      const realProject: Project = {
        title: project.data.title,
        description: project.data.description,
        tags: project.data.tags,
        articlesAbout: articlesAbout,
        content: project.content,
        link: project.data.link
          ? {
              url: project.data.link.url,
              type: project.data.link.type
            }
          : undefined
      }
      projects.push(realProject)
    }
  })
  return {
    projects,
    tags: removeDuplicates<string>(
      projects.reduce((prev, curr) => {
        return [...prev, ...curr.tags]
      }, [])
    ).sort((a, b) => {
      return a.localeCompare(b)
    })
  }
}
