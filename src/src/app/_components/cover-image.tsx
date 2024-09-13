import cn from "classnames";
import Link from "next/link";
import Image from "next/image";

type Props = {
  title: string;
  src: string;
  width: string;
  slug?: string;
};

const CoverImage = ({ title, src, slug, width }: Props) => {
  const image = (
    <Image
      src={src}
      alt={`Cover Image for ${title}`}
      className={cn(`shadow-sm ${width}`, {
        "hover:shadow-lg transition-shadow duration-200": slug,
      })}
      width={1000}
      height={1000}
    />
  );
  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link href={slug} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  );
};

export default CoverImage;
