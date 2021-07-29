import { useTheme } from "../contexts/ThemeContext";

type Props = {
    tag: string,
    allTags: string[],
    onClick?: (tag: string) => any,
    fade?: boolean
}

const Tag = ({ tag, allTags, onClick, fade = false }: Props) => {
    const { theme } = useTheme();

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

    const tagToColor = (tag: string) => {
        return theme.allColors[allTags.indexOf(tag) % theme.allColors.length]
    }

    return (
        <span onClick={(e) => {onClick ? onClick(tag) : {}}} style={{opacity: (fade ? 0.3 : 1), backgroundColor: tagToColor(tag), border: `1px solid ${lightenDarkenColor(tagToColor(tag), -20)}`}} className={theme.articlespage.tagblob}>
            {tag}
        </span>
    )
}

export default Tag