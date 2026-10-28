import TestimonialCard, { type Testimonial } from "@/components/TestimonialCard";

const testimonials: Testimonial[] = [
  {
    quote:
      "“OMG! I cannot believe that I have got a brand new landing page after getting Omega. It was super easy to edit and publish.”",
    name: "Diego Morata",
    role: "Web Developer",
  },
  {
    quote:
      "“Simply the best. Better than all the rest. I’d recommend this product to beginners and advanced users.”",
    name: "Franklin Hicks",
    role: "Digital Marketer",
  },
];

export default function Testimonials() {
  return (
    <div className="grid w-full max-w-[1073px] grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-[clamp(2rem,6.4vw,69px)]">
      {testimonials.map((testimonial) => (
        <TestimonialCard key={testimonial.name} {...testimonial} />
      ))}
    </div>
  );
}
