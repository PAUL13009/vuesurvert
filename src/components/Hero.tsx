import Image from "next/image";

type HeroProps = {
  title: string;
  subtitle?: string;
  backgroundUrl: string;
};

export default function Hero({ title, subtitle, backgroundUrl }: HeroProps) {
  return (
    <section className="relative min-h-[56vh] w-full overflow-hidden">
      <Image
        src={backgroundUrl}
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[56vh] max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white -mt-24">
          <h1 className="text-2xl font-light tracking-normal sm:text-3xl md:text-4xl">{title}</h1>
          {subtitle ? (
            <p className="mt-4 text-base sm:text-lg text-white/90">{subtitle}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}


