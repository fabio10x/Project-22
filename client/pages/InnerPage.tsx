import { Link, Navigate, useParams } from "react-router-dom";
import { innerPages } from "@/content/inner-pages";
import { cn } from "@/lib/utils";

export default function InnerPage() {
  const { slug = "" } = useParams();
  const page = innerPages[slug];

  if (!page) {
    return <Navigate to="/" replace />;
  }

  const isExternal = page.cta.to.startsWith("http");

  return (
    <main className="w-full bg-white font-gilroy">
      <section className="w-full bg-navy">
        <div className="mx-auto w-full max-w-[1110px] px-6 py-16 sm:py-20 lg:px-0">
          <nav aria-label="Breadcrumb" className="text-[14px] text-white/60">
            <ol className="flex items-center gap-2">
              <li>
                <Link to="/" className="transition-opacity hover:opacity-70">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-white" aria-current="page">
                {page.title}
              </li>
            </ol>
          </nav>
          <h1 className="mt-6 text-[36px] font-bold leading-[1.15] tracking-[-1.5px] text-white sm:text-[52px]">
            {page.title}
          </h1>
          <p className="mt-5 max-w-[640px] text-[17px] leading-8 tracking-[-0.2px] text-white/70 sm:text-[19px]">
            {page.subtitle}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1110px] px-6 py-16 lg:px-0 lg:py-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {page.sections.map((section) => (
            <article
              key={section.heading}
              className="flex flex-col gap-3 rounded-[10px] border border-[#E7E9ED] bg-white p-7 transition-shadow hover:shadow-[0_31px_34px_-20px_rgba(0,0,0,0.09)]"
            >
              <h2 className="text-[21px] font-bold leading-8 tracking-[-0.5px] text-[#161C2D]">
                {section.heading}
              </h2>
              <p className="text-[16px] leading-7 tracking-[-0.2px] text-[#161C2D]/70">
                {section.body}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start gap-4 rounded-[10px] bg-[#ECF2F7] p-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[19px] font-bold tracking-[-0.4px] text-[#161C2D]">
            Ready to get started?
          </p>
          {isExternal ? (
            <a
              href={page.cta.to}
              className={ctaClass}
            >
              {page.cta.label}
            </a>
          ) : (
            <Link to={page.cta.to} className={ctaClass}>
              {page.cta.label}
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}

const ctaClass = cn(
  "inline-flex h-[50px] items-center justify-center rounded-lg bg-[#473BF0] px-6 text-[17px] font-bold tracking-[-0.5px] text-white transition-opacity hover:opacity-90",
);
