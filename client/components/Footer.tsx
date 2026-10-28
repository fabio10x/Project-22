import { Link } from "react-router-dom";

const routes: Record<string, string> = {
  "About us": "/about",
  "Contact us": "/contact",
  Careers: "/careers",
  Press: "/press",
  Features: "/features",
  Pricing: "/pricing",
  News: "/news",
  "Help desk": "/help",
  Support: "/support",
  "Digital Marketing": "/services",
  "Content Writing": "/services",
  "SEO for Business": "/services",
  "UI Design": "/services",
  "Privacy Policy": "/privacy",
  "Terms & Conditions": "/terms",
  "Return Policy": "/returns",
};

const columns = [
  {
    title: "Company",
    links: ["About us", "Contact us", "Careers", "Press"],
  },
  {
    title: "Product",
    links: ["Features", "Pricing", "News", "Help desk", "Support"],
  },
  {
    title: "Services",
    links: [
      "Digital Marketing",
      "Content Writing",
      "SEO for Business",
      "UI Design",
    ],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms & Conditions", "Return Policy"],
  },
];

const contactDetails = [
  { label: "support@brainwave.io", href: "mailto:support@brainwave.io" },
];

const headingClass =
  "text-[15px] leading-[26px] tracking-[-0.1px] text-navy/70";
const linkClass =
  "block text-[17px] leading-10 tracking-[-0.2px] text-navy transition-opacity hover:opacity-70";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#E7E9ED] bg-white pb-8 pt-16 font-gilroy lg:pt-[120px]">
      <div className="mx-auto w-full max-w-[1111px] px-6 xl:px-0">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-[190px_190px_221px_226px_minmax(0,1fr)] lg:gap-x-0">
          {columns.map((column) => (
            <nav
              key={column.title}
              aria-label={column.title}
              className="flex flex-col gap-5"
            >
              <h3 className={headingClass}>{column.title}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link}>
                    <Link to={routes[link] ?? "/"} className={linkClass}>
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="flex flex-col gap-5">
            <h3 className={headingClass}>Contact us</h3>
            <ul>
              {contactDetails.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="block text-[17px] font-bold leading-10 tracking-[-0.2px] text-[#473BF0] transition-opacity hover:opacity-70"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-[#E7E9ED] pt-[31px] sm:flex-row sm:items-center sm:justify-between lg:mt-[108px]">
          <p className={headingClass}>
            © {new Date().getFullYear()} Brainwave.io — All rights reserved.
          </p>
          <img
            src="/images/footer-social.svg"
            alt="Follow us on social media"
            width={166}
            height={19}
            className="h-[19px] w-[166px] shrink-0"
          />
        </div>
      </div>
    </footer>
  );
}
