import Layout from '../../components/Layout'
import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';
import Link from 'next/link'
import { getAllProjects, Project, ProjectsData } from '../api/projects'
import { useTheme } from '../../contexts/ThemeContext';
import { useState } from 'react';
import Tag from '../../components/Tag'
import { Icon, InlineIcon } from '@iconify/react';
import githubIcon from '@iconify/icons-mdi/github'
import openInNew from '@iconify/icons-mdi/open-in-new'
import expander from '@iconify/icons-mdi/arrow-down-drop-circle-outline'
import Tooltipped from '../../components/Tooltipped';


type ProjectsPageProps = {
  projectsData: ProjectsData
}

export async function getStaticProps(context) {
  return {
    props: { projectsData: JSON.parse(JSON.stringify(await getAllProjects())) }
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

  const link = <a target="_blank" href={project.link.url}>
    <Icon height={40} icon={projectTypeToIcon(project.link.type)}/>
  </a>

  return (
    <div className={theme.projectsPage.projectPreviewContainer}>
      <div className={theme.projectsPage.projectPreviewHeader}>
        <div>
          <header>
            <h2>{project.title}</h2>
            {project.tags.map(tag => <Tag key={tag} tag={tag} allTags={allTags}/>)}
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
            {project.articlesAbout.map(article => <Link href={"/articles/" + article.link}><a>{article.title}</a></Link>)}
          </div>
          : null }
          <div className={theme.projectsPage.markdowncontent}>
            {content}
          </div>
        </article>
      : null }
      <svg className={theme.projectsPage.grayish} viewBox="0 0 726 1" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="0.5" x2="726" y2="0.5"/>
      </svg>
    </div>
  )
}

const ProjectsPage = ({ projectsData } : ProjectsPageProps) => {
  const { theme } = useTheme()

  return (<>
  <Layout title="Projects" currentNav="projects">
    <div className={theme.projectsPage.container}>
      <div className={theme.projectsPage.content}>
        <div className={theme.projectsPage.section}>
          <h2>All project tags</h2>
          <div className={theme.projectsPage.tagscontainer}>
            {projectsData.allTags.map(tag => <Tag key={tag} allTags={projectsData.allTags} tag={tag}/>)}
          </div>
        </div>
        <div className={theme.projectsPage.section}>
          {projectsData.projects.map(project => <ProjectPreview key={project.title} allTags={projectsData.allTags} project={project}/>)}
        </div>
      </div>
    </div>
  </Layout>
  </>
)}
  
export default ProjectsPage