import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";
import { PostTitle } from "@/app/_components/post-title";
import { type Author } from "@/interfaces/author";
import { PostTags } from "./post-tags";
import { mapPostTagIdentifierToModel } from "@/lib/api";

type Props = {
  title: string;
  date: string;
  author: Author;
  tags?: string[];
};

export function PostHeader({ title, date, author, tags }: Props) {
  return (
    <>
      <PostTitle title={title} />
      <div className={`max-w-2xl mx-auto hidden md:block md:mb-6`}>
        { tags && <PostTags 
          tags={tags.map(mapPostTagIdentifierToModel)}
        /> }
        <Avatar name={author.name} picture={author.picture} />
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="block md:hidden mb-6">
          { tags && <PostTags tags={tags.map(mapPostTagIdentifierToModel)} /> }
          <Avatar name={author.name} picture={author.picture} />
        </div>
        <div className="mb-6 text-lg">
          <DateFormatter dateString={date} />
        </div>
      </div>
    </>
  );
}
