import Layout from '../../components/Layout'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '../../contexts/ThemeContext';
import { Article, getAllArticles } from "../api/articles";
import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';
import headings from 'remark-autolink-headings'
import slug from 'remark-slug'
import mailIcon from '@iconify/icons-mdi/email'
import { Icon, InlineIcon } from '@iconify/react';
import Tag from '../../components/Tag';

type Props = {
    article: Article,
    allTags
}

export async function getStaticPaths() {
    const a = (await getAllArticles()).articles.map(article => {
        return {
            params: {
                id: article.link
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
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

export async function getStaticProps({ params }) {
    const articleData = await getAllArticles()
    const article = articleData.articles.find(article => article.link === params.id)
    const allTags = articleData.allTags

    return {
        props: {
            article: JSON.parse(JSON.stringify(article)),
            allTags: allTags
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

const ArticlePage = ({ article, allTags } : Props) => {
    const { theme } = useTheme()

    console.log(article)

    const content = unified()
    .use(parse)
    .use(remark2react, {
        remarkReactComponents: {
            // Use CustomLink instead of <a>
            a: CustomLink,
        },
    })
    .processSync(article.content).result;

    const tagToColor = (tag : string) => {
        return theme.allColors[allTags.indexOf(tag) % theme.allColors.length]
    }

    return (
        <Layout title={article.title} currentNav="">
            <div className={theme.articlespage.container}>
                <div className={theme.articlespage.content}>
                    <header>
                        <h1>{article.title}</h1>
                        <div>
                        <h2>published on {formatDate(new Date(article.date))} by <a href={article.author.link} target="_blank">{article.author.name}</a></h2><a target="_blank" href={`mailto:${article.author.email}`}><Icon className={theme.articlespage.maillink} width={25} icon={mailIcon}/></a>
                        <span>{article.tags.map(tag => <Tag tag={tag} allTags={allTags}/>)}</span>
                        </div>
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