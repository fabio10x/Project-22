import { Layers, Users, Zap } from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Organize your campaigns",
    description: "With lots of unique blocks, you can easily build a page without coding. Build your next landing page.",
  },
  {
    icon: Users,
    title: "Manage customers",
    description: "With lots of unique blocks, you can easily build a page without coding. Build your next landing page.",
  },
  {
    icon: Zap,
    title: "Track progress fast",
    description: "With lots of unique blocks, you can easily build a page without coding. Build your next landing page.",
  },
];

export default function Features() {
  return (
    <section className="w-full bg-white py-20 font-gilroy">
      <div className="mx-auto grid w-full max-w-[1112px] grid-cols-1 gap-12 px-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 lg:px-0">
        {features.map((feature) => (
          <div key={feature.title} className="flex gap-5">
            <div className="shrink-0 pt-1">
              <feature.icon className="h-9 w-9 text-[#473BF0]" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-[21px] font-bold leading-8 tracking-[-0.5px] text-[#161C2D]">
                {feature.title}
              </h3>
              <p className="text-[17px] leading-[29px] tracking-[-0.2px] text-[#161C2D]/70">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
