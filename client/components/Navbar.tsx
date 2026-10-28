import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStartTrialPath } from "@/lib/auth";
import AuthButtons from "@/components/AuthButtons";

const links = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Features", to: "/features" },
  { label: "Demos", to: "/demos" },
  { label: "Services", to: "/services" },
  { label: "Pricing", to: "/pricing" },
  { label: "Support", to: "/support" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const trialPath = useStartTrialPath();

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="w-full bg-navy font-gilroy">
      <div className="mx-auto flex w-full max-w-[1110px] items-center justify-between px-6 pt-4 lg:px-0">
        <Link
          to="/"
          className="font-rubik text-2xl font-bold tracking-[-0.133px] text-[#F4F7FA]"
        >
          Brainwave.io
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">
          <ul className="flex items-center gap-8 text-[15px] leading-[26px] tracking-[-0.1px] text-white">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    cn(
                      "transition-opacity hover:opacity-70",
                      isActive && "font-bold text-mint",
                    )
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <AuthButtons className="flex items-center gap-6" />
          <Link
            to={trialPath}
            className="flex h-[50px] w-[183px] items-center justify-center rounded-lg bg-[#473BF0] text-[17px] font-bold tracking-[-0.5px] text-white transition-opacity hover:opacity-90"
          >
            Start a free trial
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="text-white lg:hidden"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-5 px-6 pb-6 pt-6 lg:hidden">
          <ul className="flex flex-col gap-4 text-[17px] text-white">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn("transition-opacity hover:opacity-70", isActive && "font-bold text-mint")
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <AuthButtons
            className="flex items-center gap-6 text-white"
            onNavigate={() => setOpen(false)}
          />
          <Link
            to={trialPath}
            onClick={() => setOpen(false)}
            className="flex h-[50px] items-center justify-center rounded-lg bg-[#473BF0] text-[17px] font-bold tracking-[-0.5px] text-white"
          >
            Start a free trial
          </Link>
        </nav>
      )}
    </header>
  );
}
