import { Link } from "react-router-dom";
import { useStartTrialPath } from "@/lib/auth";

export default function ProgressTracking() {
  const trialPath = useStartTrialPath();
  return (
    <section className="w-full overflow-hidden bg-white py-12 font-gilroy lg:py-20">
      <div className="mx-auto grid w-full max-w-[1102px] grid-cols-1 gap-12 px-6 lg:grid-cols-[minmax(0,600px)_minmax(0,410px)] lg:justify-between lg:gap-8 lg:px-6 xl:px-0">
        <div className="relative order-2 mx-auto w-full max-w-[719px] lg:order-1 lg:mx-0 lg:aspect-[600/424] lg:max-w-[600px]">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/4cd114ed7d69dc26d3361231daa8de82d1fdd890?width=1438"
            alt="Dashboard preview showing student progress analytics"
            className="block h-auto w-full lg:absolute lg:-left-[2px] lg:-top-px lg:w-[119.83%] lg:max-w-none"
          />
        </div>

        <div className="order-1 flex w-full max-w-[410px] flex-col lg:order-2 lg:mt-[84px] lg:self-start">
          <h2 className="max-w-[389px] text-[28px] font-bold leading-9 tracking-[-1.2px] text-[#161C2D] sm:text-[36px] sm:leading-[48px]">
            Track your progress with our advanced site.
          </h2>
          <p className="mt-[21px] text-[17px] leading-[29px] tracking-[-0.2px] text-[#161C2D]/70 sm:text-[19px] sm:leading-8">
            We share common trends and strategies for improving your rental
            income and making sure you stay in high demand.
          </p>
          <Link
            to={trialPath}
            className="mt-[35px] flex h-8 w-[178px] items-center justify-between whitespace-nowrap text-[21px] font-bold leading-8 tracking-[-1.2px] text-[#473BF0] transition-opacity hover:opacity-80"
          >
            Start a free trial
            <svg
              width="15"
              height="14"
              viewBox="164 9 15 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="shrink-0"
            >
              <path
                d="M171.934 10L178 15.6333L171.934 21.2667"
                stroke="#473BF0"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="bevel"
              />
              <path
                d="M165 15.4012H177.133"
                stroke="#473BF0"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="bevel"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
