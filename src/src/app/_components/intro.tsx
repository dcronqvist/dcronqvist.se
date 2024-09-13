type IntroProps = {
  type: string;
};

export function Intro({ type }: IntroProps) {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="text-6xl md:text-7xl font-bold tracking-tighter leading-tight md:pr-8">
        dcronqvist. | {type}
      </h1>
      <h4 className="text-center md:text-right text-lg mt-5 md:pl-8 md:max-w-xl">
        welcome to my {/*<a href="/projects" className="font-bold underline hover:text-accent-1">projects</a> and <a href="/" className="font-bold underline hover:text-accent-1">*/}blog{/*</a>*/}. i write about software development, open source, and other things that interest me.  
      </h4>
    </section>
  );
}
