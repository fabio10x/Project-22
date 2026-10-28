export interface InnerPageContent {
  title: string;
  subtitle: string;
  sections: { heading: string; body: string }[];
  cta: { label: string; to: string };
}

export const innerPages: Record<string, InnerPageContent> = {
  features: {
    title: "Features",
    subtitle:
      "Everything you need to build, launch and track your landing pages in one place.",
    sections: [
      {
        heading: "Organize your campaigns",
        body: "Group pages, goals and assets into campaigns so your team always knows what is live and what is in progress.",
      },
      {
        heading: "Manage customers",
        body: "Keep every lead and customer in one timeline, with notes, tags and the full history of their interactions.",
      },
      {
        heading: "Track progress fast",
        body: "See visits, conversions and trends update in real time, and act on them before the week is over.",
      },
    ],
    cta: { label: "View pricing", to: "/pricing" },
  },
  pricing: {
    title: "Pricing & Plans",
    subtitle:
      "Simple plans for freelancers, growing teams and large companies. Cancel any time.",
    sections: [
      {
        heading: "Starter - $19 / month",
        body: "Commercial license, 100+ UI elements and support for one domain.",
      },
      {
        heading: "Standard - $49 / month",
        body: "Everything in Starter, plus unlimited domains and 6 months of premium support.",
      },
      {
        heading: "Premium - $99 / month",
        body: "Everything in Standard, plus lifetime updates for every purchase.",
      },
    ],
    cta: { label: "Start a free trial", to: "/dashboard" },
  },
  services: {
    title: "Our Services",
    subtitle:
      "Hands-on help from strategy to launch, so your brand looks and performs its best.",
    sections: [
      {
        heading: "Digital Marketing",
        body: "Campaigns across search, social and email, planned around measurable goals.",
      },
      {
        heading: "Content Writing",
        body: "Clear, persuasive copy for landing pages, blogs and product announcements.",
      },
      {
        heading: "SEO for Business",
        body: "Technical and on-page SEO that brings the right visitors to your site.",
      },
      {
        heading: "UI Design",
        body: "Interfaces that are easy to use, consistent across devices and built to convert.",
      },
    ],
    cta: { label: "Talk to our team", to: "/contact" },
  },
  demos: {
    title: "Demos",
    subtitle: "Explore live examples of pages and dashboards built with Brainwave.",
    sections: [
      {
        heading: "SaaS landing page",
        body: "A product-focused layout with hero, features, pricing and testimonials.",
      },
      {
        heading: "Consultancy website",
        body: "A services-first site with clear calls to action and case studies.",
      },
      {
        heading: "Analytics dashboard",
        body: "A sidebar layout with stats, charts and recent activity.",
      },
    ],
    cta: { label: "Open the dashboard demo", to: "/dashboard" },
  },
  support: {
    title: "Support",
    subtitle: "Get answers fast from our guides, help desk and support team.",
    sections: [
      {
        heading: "Help desk",
        body: "Browse step-by-step articles on setup, publishing and managing your account.",
      },
      {
        heading: "Premium support",
        body: "Priority email support for Standard and Premium plan members.",
      },
      {
        heading: "Report a problem",
        body: "Tell us what went wrong and we will get back to you within one business day.",
      },
    ],
    cta: { label: "Contact support", to: "/contact" },
  },
  contact: {
    title: "Contact us",
    subtitle: "Questions about a plan, a project or a partnership? We would love to hear from you.",
    sections: [
      {
        heading: "Email",
        body: "support@brainwave.io - we reply within one business day.",
      },
      {
        heading: "Phone",
        body: "+133-394-3439-1435 - Monday to Friday, 9am to 6pm.",
      },
      {
        heading: "Office",
        body: "Visit us by appointment. Send a message first to book a time.",
      },
    ],
    cta: { label: "Start a free trial", to: "/dashboard" },
  },
  about: {
    title: "About us",
    subtitle: "We build tools that help small teams publish beautiful pages without the hassle.",
    sections: [
      {
        heading: "Our mission",
        body: "Make high-quality web presence accessible to every founder, freelancer and marketer.",
      },
      {
        heading: "Our team",
        body: "Designers, writers and engineers working together from several countries.",
      },
    ],
    cta: { label: "Join us", to: "/careers" },
  },
  careers: {
    title: "Careers",
    subtitle: "Help us build the future of landing pages. We are hiring across design and engineering.",
    sections: [
      {
        heading: "Product Designer",
        body: "Full-time, remote. Own end-to-end design for dashboards and marketing pages.",
      },
      {
        heading: "Frontend Engineer",
        body: "Full-time, remote. Build fast, accessible React interfaces with TypeScript.",
      },
      {
        heading: "Content Strategist",
        body: "Part-time, remote. Write the stories and guides that help our users succeed.",
      },
    ],
    cta: { label: "Contact us about roles", to: "/contact" },
  },
  press: {
    title: "Press",
    subtitle: "News, brand assets and press contacts for journalists and partners.",
    sections: [
      {
        heading: "Press kit",
        body: "Logos, screenshots and brand guidelines for editorial use.",
      },
      {
        heading: "Media contact",
        body: "press@brainwave.io for interviews, quotes and review copies.",
      },
    ],
    cta: { label: "Read the news", to: "/news" },
  },
  news: {
    title: "News",
    subtitle: "Product updates, release notes and announcements.",
    sections: [
      {
        heading: "Dashboard launched",
        body: "A new analytics dashboard gives you visits, conversions and activity at a glance.",
      },
      {
        heading: "Pricing update",
        body: "Yearly billing now saves 25% on every plan.",
      },
    ],
    cta: { label: "Back to home", to: "/" },
  },
  help: {
    title: "Help desk",
    subtitle: "Find guides and answers to the questions we hear most often.",
    sections: [
      {
        heading: "Getting started",
        body: "Create your account, pick a template and publish your first page.",
      },
      {
        heading: "Billing",
        body: "Change plans, switch between monthly and yearly billing, or update payment details.",
      },
      {
        heading: "Account security",
        body: "Enable two-factor authentication and manage active sessions.",
      },
    ],
    cta: { label: "Contact support", to: "/contact" },
  },
  privacy: {
    title: "Privacy Policy",
    subtitle: "How we collect, use and protect your information.",
    sections: [
      {
        heading: "Information we collect",
        body: "Account details you provide and basic usage data needed to run the service.",
      },
      {
        heading: "How we use it",
        body: "To provide, improve and secure Brainwave.io. We never sell your personal data.",
      },
      {
        heading: "Your choices",
        body: "You can request access, correction or deletion of your data at any time.",
      },
    ],
    cta: { label: "Contact us with questions", to: "/contact" },
  },
  terms: {
    title: "Terms & Conditions",
    subtitle: "The rules for using Brainwave.io and its templates.",
    sections: [
      {
        heading: "License",
        body: "Plans include a commercial license for the templates you build with Brainwave.io.",
      },
      {
        heading: "Acceptable use",
        body: "Do not use the service for unlawful, abusive or deceptive content.",
      },
      {
        heading: "Changes",
        body: "We may update these terms and will notify you of material changes.",
      },
    ],
    cta: { label: "Contact us with questions", to: "/contact" },
  },
  returns: {
    title: "Return Policy",
    subtitle: "Our refund rules for plans and purchases.",
    sections: [
      {
        heading: "Free trial",
        body: "Cancel during the trial and you will not be charged.",
      },
      {
        heading: "Refunds",
        body: "Request a refund within 14 days of purchase if the product does not meet your needs.",
      },
    ],
    cta: { label: "Request a refund", to: "/contact" },
  },
};
