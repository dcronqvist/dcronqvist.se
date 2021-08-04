import fs from 'fs'
import matter from 'gray-matter'
import { Article } from 'types/articles'
import { removeDuplicates } from 'types/utils'

export const getAllArticles = () => {
    const articles : Article[] = []
    const articlesDir = './dcronqvist.se-content/articles'

    if (!fs.existsSync(articlesDir)) {
        return {
            articles: [],
            tags: []
        }
    }

    const files = fs.readdirSync(articlesDir)
    files.forEach((file) => {
        if (file !== "template.md") {
            const filePath = `${articlesDir}/${file}`
            const fileContent = fs.readFileSync(filePath, 'utf8')
            const article = matter(fileContent)
            const realArticle : Article = {
                title: article.data.title,
                date: article.data.date.toString(),
                tags: article.data.tags,
                content: article.content,
                image: article.data.image ? article.data.image : undefined,
                author: {
                    name: article.data.author.name,
                    link: article.data.author.link,
                    email: article.data.author.email
                },
                referencedProjects: article.data.projects ? article.data.projects.map(proj => {
                    return {
                        name: proj.name,
                        link: proj.link
                    }  
                }) : undefined
            }
            articles.push(realArticle)
        }
    })
    return {
        articles: articles,
        tags: removeDuplicates<string>(articles.reduce((prev, curr) => {
            return [...prev, ...curr.tags]
        }, [])).sort((a, b) => {
            return a.localeCompare(b)
        })
    }
}