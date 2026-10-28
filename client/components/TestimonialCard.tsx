export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export default function TestimonialCard({ quote, name, role }: Testimonial) {
  return (
    <figure className="flex max-w-[502px] flex-col font-gilroy">
      <svg
        width="34"
        height="27"
        viewBox="0 0 34 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="ml-[3px] mt-[15px]"
      >
        <path d="M9 0H20L11 27H0L9 0Z" fill="#473BF0" />
        <path d="M23 0H34L25 27H14L23 0Z" fill="#473BF0" />
      </svg>

      <blockquote className="mt-[45px] text-[20px] font-bold leading-[30px] tracking-[-0.5px] text-[#161C2D] sm:text-[24px] sm:leading-[34px]">
        {quote}
      </blockquote>

      <figcaption className="mt-[29px] flex flex-wrap items-center gap-x-2 text-[17px] leading-[29px] tracking-[-0.2px] text-[#161C2D]">
        <span className="font-bold">{name}</span>
        <span className="text-[#161C2D]/70">{role}</span>
      </figcaption>
    </figure>
  );
}
