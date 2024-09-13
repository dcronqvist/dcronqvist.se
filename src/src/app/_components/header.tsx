import Link from "next/link";

type HeaderProps = {
  url: string;
};

const Header = ({ url }: HeaderProps) => {
  return (
    <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8 flex items-center">
      <Link href={url} className="hover:underline">
        dcronqvist.
      </Link>
    </h2>
  );
};

export default Header;
