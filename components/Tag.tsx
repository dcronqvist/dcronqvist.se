import { Theme, useTheme } from "../contexts/ThemeContext";
import styled from "styled-components";

type Props = {
    tag: string,
    allTags: string[],
    onClick?: (tag: string) => any,
    fade?: boolean,
    bottomMargin?: boolean
}

function lightenDarkenColor(col, amt) {

    var usePound = false;
  
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
 
    var num = parseInt(col,16);
 
    var r = (num >> 16) + amt;
 
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
 
    var b = ((num >> 8) & 0x00FF) + amt;
 
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
 
    var g = (num & 0x0000FF) + amt;
 
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
 
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
  
}

const StyledTag = styled.span<{theme: Theme, marginBottom: boolean, faded: boolean, color: string}>`
    user-select: none;
    cursor: pointer;
    transition: opacity 0.2s;
    padding: 1px 3px 1px 3px;
    border-radius: 5px;
    font-size: 14px !important;
    font-weight: 400 !important;
    margin-right: 5px;
    white-space: nowrap;
    margin-bottom: ${props => (props.marginBottom ? "5px" : "0px")};
    opacity: ${props => (props.faded ? 0.3 : 1)};
    background-color: ${props => props.color};
    border: 1px solid ${props => lightenDarkenColor(props.color, -20)};
`

const Tag = ({ tag, allTags, onClick, fade = false, bottomMargin = false }: Props) => {
    const { theme } = useTheme();

    const tagToColor = (tag: string) => {
        return theme.allColors[allTags.indexOf(tag) % theme.allColors.length]
    }

    return (
        <StyledTag key={tag} onClick={(e) => {onClick ? onClick(tag) : {}}}  faded={fade} marginBottom={bottomMargin} color={tagToColor(tag)}>
            {tag}
        </StyledTag>
    )
}

export default Tag