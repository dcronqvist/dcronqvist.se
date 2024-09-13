import { ReactNode } from "react";

type Props = {
  title: string
};

export function PostTitle({ title }: Props) {
  const isShort = title.length < 20;

  return (
    <h1 className={`${isShort ? "max-w-2xl mx-auto" : ""} text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-left`}>
      {title}
    </h1>
  );
}
