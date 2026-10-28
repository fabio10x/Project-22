// Logo strip below the hero, based on the Figma frame (1601 x 95, 1px divider at the bottom).
// xl and up: a single row. The first logo starts at x=245 in the 1601px frame, and the
// left padding is calc(50% - 555.5px) so that offset stays centered at other widths.
// Smaller screens: logos wrap into a centered grid.

const logos = [
  {
    name: "MakeLess",
    src: "https://api.builder.io/api/v1/image/assets/TEMP/44c9eb99343de4091cdfb5e8bc984b4b88e51776?width=280",
    size: "h-[24px] w-[140px]",
    offset: "xl:mt-[3px]",
    gap: "",
  },
  {
    name: "Coworks",
    src: "https://api.builder.io/api/v1/image/assets/TEMP/6c0f5269b6979985a0ba48553303d499f3a207d3?width=296",
    size: "h-[30px] w-[148px]",
    offset: "xl:mt-[2px]",
    gap: "xl:ml-[74px]",
  },
  {
    name: "Greener",
    src: "https://api.builder.io/api/v1/image/assets/TEMP/04fff3c1dea9140c9442d789d2c3859e191775ba?width=294",
    size: "h-[28px] w-[147px]",
    offset: "xl:mt-[4px]",
    gap: "xl:ml-[53px]",
  },
  {
    name: "SaaS Today",
    src: "https://api.builder.io/api/v1/image/assets/TEMP/628d7438b6c15d8e78d2b4b3e86597abc5726646?width=186",
    size: "h-[34px] w-[93px]",
    offset: "xl:mt-0",
    gap: "xl:ml-[80px]",
  },
  {
    name: "Dorfus",
    src: "https://api.builder.io/api/v1/image/assets/TEMP/4ddb7dc0c6777e82f312143d1a698a661d24ae55?width=202",
    size: "h-[26px] w-[101px]",
    offset: "xl:mt-[4px]",
    gap: "xl:ml-[76px]",
  },
  {
    name: "Askimat",
    src: "https://api.builder.io/api/v1/image/assets/TEMP/bcb0c4052b6abcb215482e387105646db1b0d3a1?width=220",
    size: "h-[30px] w-[110px]",
    offset: "xl:mt-0",
    gap: "xl:ml-[82px]",
  },
];

export default function Logos() {
  return (
    <section aria-label="Trusted by" className="w-full border-b border-[#E6ECF1] bg-white">
      <ul className="mx-auto flex w-full max-w-[1601px] flex-wrap items-center justify-center gap-x-10 gap-y-8 px-6 py-8 xl:h-[94px] xl:flex-nowrap xl:items-start xl:justify-start xl:gap-0 xl:py-0 xl:pl-[calc(50%-555.5px)] xl:pr-0">
        {logos.map((logo) => (
          <li key={logo.name} className={`shrink-0 ${logo.offset} ${logo.gap}`}>
            <img
              src={logo.src}
              alt={logo.name}
              className={`${logo.size} object-contain opacity-80`}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
