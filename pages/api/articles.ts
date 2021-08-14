import fs from 'fs'
import matter from 'gray-matter'
import { Article } from '@model/articles'
import { removeDuplicates } from '@model/utils'
import readingTime from 'reading-time'

export const getAllArticles = (): { articles: Article[]; tags: string[] } => {
  const articles: Article[] = []
  const articlesDir = './dcronqvist.se-content/articles'

  if (!fs.existsSync(articlesDir)) {
    return {
      articles: [],
      tags: []
    }
  }

  const files = fs.readdirSync(articlesDir)

  files.forEach((file) => {
    if (file !== 'template.md') {
      const filePath = `${articlesDir}/${file}`
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const article = matter(fileContent)
      const realArticle: Article = {
        title: article.data.title,
        date: article.data.date.toString(),
        tags: article.data.tags,
        content: article.content,
        image: article.data.image ? article.data.image : null,
        author: {
          name: article.data.author.name,
          link: article.data.author.link,
          email: article.data.author.email
        },
        referencedProjects: article.data.projects
          ? article.data.projects.map((proj) => {
              return {
                name: proj.name,
                link: proj.link
              }
            })
          : [],
        readingTime: readingTime(article.content).minutes,
        subHeader: article.data.subheader ? article.data.subheader : null
      }
      articles.push(realArticle)
    }
  })
  return {
    articles: articles,
    tags: removeDuplicates<string>(
      articles.reduce((prev, curr) => {
        return [...prev, ...curr.tags]
      }, [])
    ).sort((a, b) => {
      return a.localeCompare(b)
    })
  }
}
