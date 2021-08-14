import { Article } from '@model/articles'
import styled from 'styled-components'
import mailIcon from '@iconify/icons-mdi/email'
import { Icon } from '@iconify/react'
import moment from 'moment'
import Tag from './Tag'
import { Theme, useTheme } from '@contexts/ThemeContext'

export type ArticleHeaderProps = {
  article: Article
  allTags: string[]
}

const HeaderWrapper = styled.header<{ theme: Theme }>`
  padding-top: 20px;
  background-color: ${(props) => props.theme.backgroundAccent};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  & > div {
    max-width: 800px;
    width: 90%;
  }
`

const ArticleTitle = styled.h1`
  display: inline;
  font-size: 44px;
  margin: 0;

  @media (max-width: 800px) {
    font-size: 24px;
  }
`

const AuthorWrapper = styled.div<{ theme: Theme }>`
  font-size: 16px;
  padding: 5px 0px;
  font-weight: 500;
  display: table-cell;

  & div:first-child {
    display: flex;
    align-items: center;
    transition: all 0.2s ease;
    color: ${(props) => props.theme.onBackgroundAccent};
    margin-bottom: 2px;
  }
`

const AuthorName = styled.span`
  margin-right: 5px;
`

const InfoWrapper = styled.div<{ theme: Theme }>`
  font-size: 16px;
  color: ${(props) => props.theme.onBackgroundAccent};
  transition: all 0.2s ease;

  & span:last-child {
    font-weight: 400;
  }
`

const StyledLinkIcon = styled.a`
  height: 20px;
  width: fit-content;
  color: inherit;
`

const AuthorPublication = ({ article }: { article: Article }): JSX.Element => {
  const { theme } = useTheme()

  const formatDate = (date: string): string => {
    const dateObj = new Date(date)
    return moment(dateObj).format('Do MMM, YYYY')
  }

  return (
    <AuthorWrapper theme={theme}>
      <div>
        <AuthorName>{article.author.name}</AuthorName>
        <StyledLinkIcon target="_blank" href={`mailto:${article.author.email}`}>
          <Icon height={20} icon={mailIcon} />
        </StyledLinkIcon>
      </div>
      <InfoWrapper theme={theme}>
        <span>{formatDate(article.date)}</span>
        {'  ·  '}
        <span>{Math.round(article.readingTime)} minute read</span>
      </InfoWrapper>
    </AuthorWrapper>
  )
}

const StyledTagContainer = styled.div`
  margin: 5px 0px;
`

const TagContainer = ({
  allTags,
  articleTags
}: {
  allTags: string[]
  articleTags: string[]
}) => {
  return (
    <StyledTagContainer>
      {articleTags.map((tag, index) => {
        return <Tag key={`${tag}-${index}`} tag={tag} allTags={allTags} />
      })}
    </StyledTagContainer>
  )
}

const StyledArticleImg = styled.img`
  width: 20%;
  float: right;
  display: inline;

  @media (max-width: 800px) {
    width: 29%;
  }
`

const ArticleSubHeader = styled.h2<{ theme: Theme }>`
  font-size: 24px;
  margin: 0;
  font-weight: 500;
  color: ${(props) => props.theme.onBackgroundAccent};
  transition: all 0.2s ease;
  margin: 20px 0px;

  @media (max-width: 800px) {
    font-size: 16px;
  }
`

const ArticleHeader = ({
  article,
  allTags
}: ArticleHeaderProps): JSX.Element => {
  const { theme } = useTheme()

  return (
    <HeaderWrapper theme={theme}>
      <div>
        {article.image ? <StyledArticleImg src={article.image} /> : ''}
        <ArticleTitle>{article.title}</ArticleTitle>
        <AuthorPublication article={article} />
        <TagContainer allTags={allTags} articleTags={article.tags} />
        <ArticleSubHeader theme={theme}>{article.subHeader}</ArticleSubHeader>
      </div>
    </HeaderWrapper>
  )
}

export default ArticleHeader
