import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypePrettyCode from "rehype-pretty-code";
import { unified, Plugin } from "unified";
import type { Root, Element } from 'hast';
import { visit } from 'unist-util-visit';

export default async function markdownToHtml(markdown: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: {
        dark: "ayu-dark",
        light: "everforest-light",
      },
      keepBackground: false
    })
    .use(rehypeDocument)
    .use(rehypeFormat)
    .use(rehypeStringify)
    .use(rehypeVideo)
    .process(markdown);
  return result.toString();
}

const properties = { muted: 'muted', controls: 'controls' };

function reElement(node: Element, href: string) {
  node.tagName = 'video';
  node.children = [];
  node.properties = { ...properties, src: href };
}

const rehypeVideo: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const isVideo = (url: string) => url.endsWith('.mp4');
      const child = node.children[0];

      if (node.tagName === 'p' && node.children.length === 1) {
        if (child.type === 'text' && isVideo(child.value)) {
          reElement(node, child.value);
        }
      }
    });
  }
}