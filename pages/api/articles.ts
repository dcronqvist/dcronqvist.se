import fs from 'fs'
import matter from 'gray-matter'

export type Project = {
    name: string,
    link: string,
}

export type Author = {
    name: string
    link: string
    email: string
}

export type Article = {
    title: string
    date: string
    tags: Array<string>
    content: string
    link: string
    image: string | undefined
    slug: string
    author: Author,
    projects: Project[] | undefined
}

export type ArticleData = {
    articles: Article[]
    allTags: Array<string>
}

export const articleToLink = (article: matter.GrayMatterFile<string>) => {
    return article.data.title.toLowerCase().replace(/[!']+/g, "").replace(/[^a-z0-9]+/g, '-')
}

const removeDups = (arr: Array<string>) => {
    const seen = new Set()
    return arr.filter(x => {
        if (seen.has(x)) {
            return false
        }
        seen.add(x)
        return true
    })
}


export async function getAllArticles() : Promise<ArticleData> {
    const articles : Article[] = []
    const articlesDir = './dcronqvist.se-content/articles'

    if (!fs.existsSync(articlesDir)) {
        return {
            articles: [],
            allTags: [],
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
                date: article.data.date,
                tags: article.data.tags,
                content: article.content,
                link: articleToLink(article),
                slug: articleToLink(article),
                image: article.data.image ? article.data.image : undefined,
                author: {
                    name: article.data.author.name,
                    link: article.data.author.link,
                    email: article.data.author.email
                },
                projects: article.data.projects ? article.data.projects.map(proj => {
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
        articles,
        allTags: removeDups(articles.reduce((prev, curr) => {
            return [...prev, ...curr.tags]
        }, [])).sort((a, b) => {
            return a.localeCompare(b)
        })
    }
}

export default async function handler(req, res) {
    res.status(200).json(await getAllArticles())
}