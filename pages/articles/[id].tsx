import Layout from '../../components/Layout'
import Link from 'next/link'
import { useTheme } from '../../contexts/ThemeContext';
import { getAllArticles } from "../api/articles";
import { Article, getArticleLink } from 'types/articles'
import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';
import mailIcon from '@iconify/icons-mdi/email'
import { Icon } from '@iconify/react';
import Tag from '../../components/Tag';

type Props = {
    article: Article,
    tags: string[]
}

export async function getStaticPaths() {
    const a = (await getAllArticles()).articles.map(article => {
        return {
            params: {
                id: getArticleLink(article)
            }
        }
    })

    return {
        paths: [
            ...a
        ],
        fallback: false
    }
}

const formatDate = (date : Date) => {
    return `${date.getFullYear()}-${date.getMonth() < 9 ? "0" : ""}${date.getMonth() + 1}-${date.getDate() < 9 ? "0" : ""}${date.getDate()}`
}

export async function getStaticProps({ params }) {
    const articlesData = getAllArticles()
    const article = articlesData.articles.find(article => getArticleLink(article) === params.id)
    const allTags = articlesData.tags

    return {
        props: {
            article: JSON.parse(JSON.stringify(article)),
            tags: allTags
        }
    }
}

function CustomLink({ children, href }) {
    // If the link is local it will start with a "/"
    // Otherwise it'll be something like "https://"
    return href.startsWith('/') || href === '' || href.startsWith("#") ? (
      <Link href={href}>
        <a>
          {children}
        </a>
      </Link>
    ) : (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

const ArticlePage = ({ article, tags } : Props) => {
    const { theme } = useTheme()

    const content = unified()
    .use(parse)
    .use(remark2react, {
        remarkReactComponents: {
            // Use CustomLink instead of <a>
            a: CustomLink,
        },
    })
    .processSync(article.content).result;

    return (
        <Layout title={article.title} currentNav="">
            <div className={theme.articlespage.container}>
                <div className={theme.articlespage.content}>
                    <header>
                        <h1>{article.title}</h1>
                        <div>
                        <h2>published on {formatDate(new Date(article.date))} by <a href={article.author.link} target="_blank">{article.author.name}</a></h2><a target="_blank" href={`mailto:${article.author.email}`}><Icon className={theme.articlespage.maillink} width={25} icon={mailIcon}/></a>
                        <span>{article.tags.map(tag => <Tag key={tag} tag={tag} allTags={tags}/>)}</span>
                        </div>
                        {article.referencedProjects ? 
                        <div>
                            <h2>references {article.referencedProjects?.length > 1 ? "projects" : "project"}{' '}{article.referencedProjects.map(project => <><a key={project.link} target="_blank" href={project.link}>{project.name}</a>{' '}</>)}</h2>
                        </div>
                        : ""}
                    </header>
                    <article>
                        {article.image ? 
                        <div className={theme.articlespage.articleimg}>
                            <img src={"/" + article.image}/>
                        </div>
                        : ""}
                        <div className={theme.articlespage.markdowncontent}>
                            {content}
                        </div>
                    </article>
                </div>
            </div>
        </Layout>
    )
}

export default ArticlePage