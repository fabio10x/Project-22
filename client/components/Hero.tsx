import { Link } from "react-router-dom";
import { useStartTrialPath } from "@/lib/auth";

export default function Hero() {
  const trialPath = useStartTrialPath();
  return (
    <section className="relative w-full overflow-hidden bg-navy font-gilroy">
      <div className="mx-auto flex w-full max-w-[1113px] flex-col items-center gap-16 px-6 py-16 sm:py-20 lg:min-h-[704px] lg:flex-row lg:justify-between lg:gap-8 lg:px-0 lg:pb-[42px] lg:pt-0">
        <div className="flex w-full max-w-[541px] flex-col items-start gap-[30px] lg:w-[541px] lg:shrink-0">
          <h1 className="text-[40px] font-bold leading-[1.08] tracking-[-2px] text-white sm:text-[52px] lg:text-[60px] lg:leading-[65px]">
            Get more visitors, get more sales.
          </h1>
          <p className="max-w-[500px] text-[17px] leading-8 tracking-[-0.2px] text-white/65 sm:text-[19px]">
            With lots of unique blocks, you can easily build a page without
            coding. Build your next consultancy website within few minutes.
          </p>
          <Link
            to={trialPath}
            className="mt-[6px] inline-flex items-center gap-[23px] text-[21px] font-bold leading-8 tracking-[-1.2px] text-mint"
          >
            Start a free trial
            <svg
              width="14"
              height="12"
              viewBox="0 0 14 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="-ml-[11px]"
              aria-hidden="true"
            >
              <path
                d="M6.934 0L13 5.633L6.934 11.267"
                stroke="#68D585"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="bevel"
              />
              <path
                d="M0 5.401H12.133"
                stroke="#68D585"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="bevel"
              />
            </svg>
          </Link>
        </div>

        <div className="relative w-full max-w-[541px] lg:w-[541px] lg:shrink-0">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/b36de2715a06b4e6c7e9c6434be93ddae320d9c2?width=416"
            alt="Dots"
            className="pointer-events-none absolute -right-6 -top-8 hidden h-[189px] w-[208px] sm:block lg:-right-[38px]"
          />
          <div className="relative aspect-[541/383] w-full">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/c6e69a84b4943ba142e5baaf0bd10ff7fe95bd2e?width=1082"
              alt="BG"
              className="absolute inset-0 h-full w-full rounded-lg object-cover"
            />
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/a0aec7389b59c267fe9e6cb147a75e605ac97963?width=1082"
              alt="BG"
              className="absolute inset-0 h-full w-full rounded-lg object-cover"
            />
            <div className="absolute inset-0 rounded-lg bg-navy opacity-[0.1877] shadow-[0_31px_34px_-20px_rgba(0,0,0,0.09)]" />
            <button
              type="button"
              aria-label="Play video"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <svg
                width="92"
                height="92"
                viewBox="0 0 92 92"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 sm:h-[92px] sm:w-[92px]"
              >
                <circle cx="46" cy="46" r="46" fill="white" />
                <path
                  d="M51.844 45.7232L40.4597 39.0415C40.3644 38.9856 40.2475 38.9862 40.1529 39.0432C40.0582 39.1002 39.9999 39.205 40 39.3183V52.6817C39.9999 52.795 40.0582 52.8998 40.1529 52.9568C40.2475 53.0138 40.3644 53.0144 40.4597 52.9585L51.844 46.2768C51.9404 46.2203 52 46.1146 52 46C52 45.8854 51.9404 45.7797 51.844 45.7232Z"
                  fill="#473BF0"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
