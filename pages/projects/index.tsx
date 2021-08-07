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
import styled from 'styled-components';


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

const ProjectPreviewContainer = styled.div`
  margin-top: 10px;

  & article {
    width: 100%;
  }
`

const ProjectPreviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  & header {
    display: flex;
    align-items: center;
  }

  & header div {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    max-width: 50%;
  }

  & h3 {
    font-size: 18px;
    font-weight: 300;
    color: #6b6b6b;
    margin: 0;
  }

  & header h2 {
    margin: 0;
    margin-right: 10px;
  }
`

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  color: black;

  & a {
    color: black;
  }
`

const PointerOnHover = styled.div`
  cursor: pointer;
`

const ReferencedArticlesContainer = styled.div`
  margin-left: 20px;
  margin-bottom: 20px;
  text-align: right;
  width: 40%;
  float: right;
  display: inline;

  & h3 {
    font-size: 18px;
    margin: 0;
  }

  & a {
    color: black;
    text-decoration: underline;
  }
`

const MarkdownContent = styled.div`
  height: max(100vh, 100%);
  display: inline;

  & a {
    font-weight: 500;
    color: black;
    text-decoration: underline;
  }

  & a:hover {
    color: #408080;
  }

  & p {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  & h3 {
    margin-block-start: 1rem;
    margin-block-end: 1rem;
  }

  & h4 {
    margin-block-start: 1rem;
    margin-block-end: 1rem;
  }
` 

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
    <ProjectPreviewContainer>
      <ProjectPreviewHeader>
        <div>
          <header>
            <h2>{project.title}</h2>
            <div>
              {project.tags.map(tag => <Tag bottomMargin={true} key={tag} tag={tag} allTags={allTags}/>)}
            </div>
          </header>
          <h3>{project.description}</h3>
        </div>
        <IconContainer>
          {link}
          <PointerOnHover onClick={(e) => setExpanded(!expanded)}>
            <Icon vFlip={expanded} height={40} icon={expander}/>
          </PointerOnHover>
        </IconContainer>
      </ProjectPreviewHeader>
      { expanded ? 
        <article>
          { project.articlesAbout.length > 0 ? 
          <ReferencedArticlesContainer>
            <h3>Related articles</h3>
            {project.articlesAbout.map(article => <Link href={"/articles/" + getArticleLink(article)}><a>{article.title}</a></Link>)}
          </ReferencedArticlesContainer>
          : null }
          <MarkdownContent>
            {content}
          </MarkdownContent>
        </article>
      : null }
    </ProjectPreviewContainer>
  )
}

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
`

const Section = styled.div`

`

const Content = styled.div`
  padding-top: 20px;
  min-height: calc(82vh - 20px);
  position: relative;
  width: 750px;

  & ${Section} {
    padding: 12px;
  }
`

const TagsContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`

const ProjectsPage = ({ projects, tags } : ProjectsPageProps) => {
  const { theme } = useTheme()
  const [selectedTag, setSelectedTag] = useState<string>("")

  const lines = (amount) => {
    const lines = []

    for (let i = 0; i < amount; i++) {
      lines.push(<svg key={i} stroke={"rgb(168, 168, 168)"} viewBox="0 0 726 1" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="0.5" x2="726" y2="0.5"/>
     </svg>)
    }

    return lines
  }

  const selectedProjects = selectedTag == "" ? projects : projects.filter(project => project.tags.includes(selectedTag))

  return (<>
  <Layout title="Projects" currentNav="projects">
    <PageContainer>
      <Content>
        <Section>
          <h2>All project tags</h2>
          <TagsContainer>
            {tags.map(tag => <Tag bottomMargin={true}  onClick={() => {
                if(selectedTag === tag) {
                  setSelectedTag("")
                } else {
                  setSelectedTag(tag)
                }
              }} fade={selectedTag !== "" && selectedTag !== tag} key={tag} allTags={tags} tag={tag}/>)}
          </TagsContainer>
        </Section>
        <Section>
          {interleave(selectedProjects.map(project => <ProjectPreview key={project.title} allTags={tags} project={project}/>), lines(selectedProjects.length - 1))}
        </Section>
      </Content>
    </PageContainer>
  </Layout>
  </>
)}
  
export default ProjectsPage