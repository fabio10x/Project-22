import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useStartTrialPath } from "@/lib/auth";

export default function ContentThree() {
  const trialPath = useStartTrialPath();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 500);
    };
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return (
    <section className="w-full bg-white py-16 sm:py-24 font-gilroy">
      <div className="mx-auto flex w-full max-w-[1011px] flex-col items-center gap-16 px-6 lg:flex-row lg:justify-between lg:gap-8 lg:px-0">
        
        {/* Left Column: Image Mosaic */}
        {isMobile ? (
          <div className="grid grid-cols-2 gap-4 w-full">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/1dac303d2388667880dbbb4b9f6e0008a80e9fb1?width=424"
              alt="Customer service team"
              className="w-full aspect-[212/206] rounded-lg object-cover shadow-sm"
            />
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/1f7c6e10c9191753b867e7f957e77b24101e24c2?width=424"
              alt="Happy client"
              className="w-full aspect-[212/255] rounded-lg object-cover shadow-sm"
            />
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/7777f93b8b84b83a720169fc06f3ff41f80e9410?width=424"
              alt="Workspace setup"
              className="w-full aspect-[212/255] rounded-lg object-cover shadow-sm"
            />
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/a04f0a3642e6f76666dd82fcf3c06b0bcb296117?width=424"
              alt="Team discussion"
              className="w-full aspect-[212/206] rounded-lg object-cover shadow-sm"
            />
          </div>
        ) : (
          <div className="relative h-[511px] w-[449px] shrink-0">
            {/* Top Left Image: width 212px, height 206px */}
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/1dac303d2388667880dbbb4b9f6e0008a80e9fb1?width=424"
              alt="Customer service team"
              className="absolute left-0 top-0 h-[206px] w-[212px] rounded-lg object-cover shadow-sm"
            />
            {/* Bottom Left Image: width 212px, height 255px, top 231px */}
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/7777f93b8b84b83a720169fc06f3ff41f80e9410?width=424"
              alt="Workspace setup"
              className="absolute left-0 top-[231px] h-[255px] w-[212px] rounded-lg object-cover shadow-sm"
            />
            {/* Top Right Image: width 212px, height 255px, left 237px, top 25px */}
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/1f7c6e10c9191753b867e7f957e77b24101e24c2?width=424"
              alt="Happy client"
              className="absolute left-[237px] top-[25px] h-[255px] w-[212px] rounded-lg object-cover shadow-sm"
            />
            {/* Bottom Right Image: width 212px, height 206px, left 237px, top 305px */}
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/a04f0a3642e6f76666dd82fcf3c06b0bcb296117?width=424"
              alt="Team discussion"
              className="absolute left-[237px] top-[305px] h-[206px] w-[212px] rounded-lg object-cover shadow-sm"
            />
          </div>
        )}

        {/* Right Column: Copy + CTA Button */}
        <div className="flex w-full max-w-[410px] flex-col items-start lg:w-[410px] lg:shrink-0 lg:pt-10">
          <h2 className="text-[36px] font-bold leading-[48px] tracking-[-1.2px] text-[#161C2D]">
            Make your customers happy by giving services.
          </h2>
          <p className="mt-[21px] text-[19px] leading-8 tracking-[-0.2px] text-[#161C2D]/70">
            We share common trends and strategies for improving your rental income and making sure you stay in high demand.
          </p>
          <Link
            to={trialPath}
            className="group mt-[35px] inline-flex items-center gap-[23px] text-[21px] font-bold leading-8 tracking-[-1.2px] text-[#473BF0]"
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

      </div>
    </section>
  );
}
