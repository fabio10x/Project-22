import { Link } from "react-router-dom";
import { useStartTrialPath } from "@/lib/auth";

export default function ContentTwo() {
  const trialPath = useStartTrialPath();
  return (
    <section className="w-full bg-white py-16 font-gilroy sm:py-24">
      <div className="mx-auto flex w-full max-w-[1110px] flex-col gap-16 px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-0">
        {/* Left Column: Copy + CTA */}
        <div className="flex w-full max-w-[434px] flex-col items-start gap-[21px] lg:w-[434px] lg:shrink-0">
          <h2 className="text-[36px] font-bold leading-[48px] tracking-[-1.2px] text-navy">
            Understand your visitors fast. Take quick actions.
          </h2>
          <p className="text-[19px] leading-8 tracking-[-0.2px] text-navy/70">
            We share common trends and strategies for improving your rental
            income and making sure you stay in high demand.
          </p>
          <Link
            to={trialPath}
            className="group mt-[14px] inline-flex items-center gap-[23px] text-[21px] font-bold leading-8 tracking-[-1.2px] text-[#473BF0]"
          >
            Start a free trial
            <svg
              width="14"
              height="12"
              viewBox="0 0 14 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="-ml-[11px] transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            >
              <path
                d="M6.934 0L13 5.633L6.934 11.267"
                stroke="#473BF0"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="bevel"
              />
              <path
                d="M0 5.401H12.133"
                stroke="#473BF0"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="bevel"
              />
            </svg>
          </Link>
        </div>

        {/* Right Column: Overlapping images (Figma frame 509 x 468) */}
        <div className="relative aspect-[509/468] w-full max-w-[509px] lg:w-[509px] lg:shrink-0">
          <img
            src="/images/content02-back-56586a.png"
            alt=""
            aria-hidden="true"
            className="absolute left-[48.13%] top-[10.04%] h-[81.62%] w-[51.87%] rounded-lg object-cover opacity-50"
          />
          <img
            src="/images/content02-front-56586a.png"
            alt="Dashboard preview showing visitor insights"
            className="absolute left-0 top-0 h-full w-[64.24%] rounded-lg object-cover shadow-[0_31px_34px_-20px_rgba(0,0,0,0.09)]"
          />
        </div>
      </div>
    </section>
  );
}
