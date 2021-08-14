import { Theme, useTheme } from '../contexts/ThemeContext'
import styled from 'styled-components'
import { lightenDarkenColor } from '@model/utils'

type Props = {
  tag: string
  allTags: string[]
  onClick?: (tag: string) => any // eslint-disable-line
  fade?: boolean
  bottomMargin?: boolean
}

const StyledTag = styled.span<{
  theme: Theme
  marginBottom: boolean
  faded: boolean
  color: string
}>`
  user-select: none;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 1px 3px 1px 3px;
  border-radius: 5px;
  font-size: 14px !important;
  font-weight: 400 !important;
  margin-right: 5px;
  white-space: nowrap;
  margin-bottom: ${(props) => (props.marginBottom ? '5px' : '0px')};
  opacity: ${(props) => (props.faded ? 0.3 : 1)};
  background-color: ${(props) => props.color};
  color: ${(props) => props.theme.tagTextColor};
  border: 1px solid ${(props) => lightenDarkenColor(props.color, -20)};
`

const Tag = ({
  tag,
  allTags,
  onClick,
  fade = false,
  bottomMargin = false
}: Props): JSX.Element => {
  const { theme } = useTheme()

  const tagToColor = (tag: string) => {
    return theme.tagColors[allTags.indexOf(tag) % theme.tagColors.length]
  }

  return (
    <StyledTag
      theme={theme}
      key={tag}
      onClick={() => {
        onClick ? onClick(tag) : {}
      }}
      faded={fade}
      marginBottom={bottomMargin}
      color={tagToColor(tag)}
    >
      {tag}
    </StyledTag>
  )
}

export default Tag
