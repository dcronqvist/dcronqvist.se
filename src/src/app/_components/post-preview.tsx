import { type Author } from "@/interfaces/author";
import Link from "next/link";
import Avatar from "./avatar";
import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  date: string;
  excerpt?: string;
  author?: Author;
  slug: string;
};

export function PostPreview({
  title,
  date,
  excerpt,
  author,
  slug,
}: Props) {
  return (
    <div>
      <h3 className="text-3xl mb-3 leading-snug">
        <Link href={`/posts/${slug}`} className="hover:underline">
          {title}
        </Link>
      </h3>
      <div className="text-lg mb-4">
        <DateFormatter dateString={date} />
      </div>
      { excerpt !== undefined ? <p className="text-lg leading-relaxed mb-4 truncate sm:whitespace-normal">{excerpt}</p> : null }
      { author != undefined ? (<Avatar name={author.name} picture={author.picture} />) : null }
    </div>
  );
}
