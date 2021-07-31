import fs from 'fs'
import matter from 'gray-matter'
import { Article, getAllArticles } from './articles'

export type ProjectsData = {
    projects: Project[],
    allTags: string[],
}

export type ProjectLink = {
    url: string,
    type: "github-repo" | "other"
}

export type Project = {
    title: string,
    tags: string[],
    description: string,
    articlesAbout: Article[],
    content: string,
    link: ProjectLink
}

export const projectToLink = (project: Project) => {
    return project.title.toLowerCase().replace(/[!']+/g, "").replace(/[^a-z0-9]+/g, '-')
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

export async function getAllProjects() : Promise<ProjectsData> {
    const projects : Project[] = []
    const projectsDir = './content/projects'
    const files = fs.readdirSync(projectsDir)

    const articles = await getAllArticles()

    files.forEach((file) => {
        if (file !== "template.md") {
            const filePath = `${projectsDir}/${file}`
            const fileContent = fs.readFileSync(filePath, 'utf8')
            const project = matter(fileContent)

            const articlesAbout = articles.articles.filter((article) => {
                return article.projects.map(proj => proj.name).includes(project.data.title)
            })

            const realProject : Project = {
                title: project.data.title,
                description: project.data.description,
                tags: project.data.tags,
                articlesAbout: articlesAbout,
                content: project.content,
                link: {
                    url: project.data.link.url,
                    type: project.data.link.type
                }
            }
            projects.push(realProject)
        }
    })
    return {
        projects,
        allTags: removeDups(projects.reduce((prev, curr) => {
            return [...prev, ...curr.tags]
        }, [])).sort((a, b) => {
            return a.localeCompare(b)
        }),
    }
}