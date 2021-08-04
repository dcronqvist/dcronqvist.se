import Layout from '../../components/Layout'
import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';
import Link from 'next/link'
import { getAllProjects } from '../api/projects'
import { useTheme } from '../../contexts/ThemeContext';
import { useState } from 'react';
import Tag from '../../components/Tag'
import { Icon, InlineIcon } from '@iconify/react';
import githubIcon from '@iconify/icons-mdi/github'
import openInNew from '@iconify/icons-mdi/open-in-new'
import expander from '@iconify/icons-mdi/arrow-down-drop-circle-outline'
import Tooltipped from '../../components/Tooltipped';
import { Project } from 'types/projects';
import { getArticleLink } from 'types/articles';


type ProjectsPageProps = {
  projects: Project[]
  tags: string[]
}

export async function getStaticProps(context) {
  const projects = getAllProjects()

  return {
    props: { 
      projects: projects.projects,
      tags: projects.tags
    }
  }
}

const interleave = (arr, arr2) => arr
  .reduce((combArr, elem, i) => combArr.concat(elem, arr2[i]), []); 

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

const projectTypeToIcon = (type: string) => {

  if (type === "github-repo") {
    return githubIcon
  }

  return openInNew
}

const ProjectPreview = ({ project, allTags }: { project: Project, allTags: string[] }) => {
  const { theme } = useTheme()
  const [expanded, setExpanded] = useState<boolean>(false)

  const content = unified()
  .use(parse)
  .use(remark2react, {
      remarkReactComponents: {
          // Use CustomLink instead of <a>
          a: CustomLink,
      },
  })
  .processSync(project.content).result;

  const link = project.link ? <a target="_blank" href={project.link.url}>
    <Icon height={40} icon={projectTypeToIcon(project.link.type)}/>
  </a> : ""

  return (
    <div className={theme.projectsPage.projectPreviewContainer}>
      <div className={theme.projectsPage.projectPreviewHeader}>
        <div>
          <header>
            <h2>{project.title}</h2>
            <div>
              {project.tags.map(tag => <Tag bottomMargin={true} key={tag} tag={tag} allTags={allTags}/>)}
            </div>
          </header>
          <h3>{project.description}</h3>
        </div>
        <div className={theme.projectsPage.iconcontainer}>
          {link}
          <div className={theme.projectsPage.pointerOnHover} onClick={(e) => setExpanded(!expanded)}>
            <Icon vFlip={expanded} height={40} icon={expander}/>
          </div>
        </div>
      </div>
      { expanded ? 
        <article>
          { project.articlesAbout.length > 0 ? 
          <div className={theme.projectsPage.referencearticles}>
            <h3>Related articles</h3>
            {project.articlesAbout.map(article => <Link href={"/articles/" + getArticleLink(article)}><a>{article.title}</a></Link>)}
          </div>
          : null }
          <div className={theme.projectsPage.markdowncontent}>
            {content}
          </div>
        </article>
      : null }
    </div>
  )
}

const ProjectsPage = ({ projects, tags } : ProjectsPageProps) => {
  const { theme } = useTheme()
  const [selectedTag, setSelectedTag] = useState<string>("")

  const lines = (amount) => {
    const lines = []

    for (let i = 0; i < amount; i++) {
      lines.push(<svg key={i} className={theme.projectsPage.grayish} viewBox="0 0 726 1" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="0.5" x2="726" y2="0.5"/>
     </svg>)
    }

    return lines
  }

  const selectedProjects = selectedTag == "" ? projects : projects.filter(project => project.tags.includes(selectedTag))

  return (<>
  <Layout title="Projects" currentNav="projects">
    <div className={theme.projectsPage.container}>
      <div className={theme.projectsPage.content}>
        <div className={theme.projectsPage.section}>
          <h2>All project tags</h2>
          <div className={theme.projectsPage.tagscontainer}>
            {tags.map(tag => <Tag bottomMargin={true}  onClick={() => {
                if(selectedTag === tag) {
                  setSelectedTag("")
                } else {
                  setSelectedTag(tag)
                }
              }} fade={selectedTag !== "" && selectedTag !== tag} key={tag} allTags={tags} tag={tag}/>)}
          </div>
        </div>
        <div className={theme.projectsPage.section}>
          {interleave(selectedProjects.map(project => <ProjectPreview key={project.title} allTags={tags} project={project}/>), lines(selectedProjects.length - 1))}
        </div>
      </div>
    </div>
  </Layout>
  </>
)}
  
export default ProjectsPage