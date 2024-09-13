import markdownStyles from "./markdown-styles.module.css";

type Node<T> = {
  text: string;
  url: string;
  children: Node<T>[];
}

type Props = {
  content: string;
};

function Toc({ node }: { node: Node<string> }) {
  if (node.children.length === 0) {
    return (
      <li key={node.url}>
        <a
          href={node.url}
          className="hover:text-blue-600"
        >
          {node.text}
        </a>
      </li>
    );
  }

  const children = node.children.map((child) => <Toc node={child} />);
  return (
    <li key={node.url}>
      <a
        href={node.url}
        className="hover:text-blue-600"
      >
        {node.text}
      </a>
      <ul>{children}</ul>
    </li>
  );
}

export function PostBody({ content }: Props) {
  return (
    <div className="md:flex">
      <aside className="hidden md:block h-screen sticky top-5 m">
      </aside>

      <div className="max-w-2xl mx-auto">
        <div
          className={markdownStyles["markdown"]}
          dangerouslySetInnerHTML={{ __html: content }}
          />
      </div>
    </div>
  );
}
