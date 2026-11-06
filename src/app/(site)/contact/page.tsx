import type { Metadata } from "next";
import { Reveal } from "@/components/flow/Reveal";
import { WaveMask } from "@/components/flow/WaveMask";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { contactForm, contactHero, contactMeta } from "@/content/contact";

export const metadata: Metadata = {
  title: contactMeta.title,
  description: contactForm.heading,
};

export default function ContactPage() {
  return (
    <>
      <section className="sec phero contact-hero" id="hero">
        <div className="wrap phero-grid">
          <div>
            <Reveal as="h1">{contactHero.heading}</Reveal>
          </div>
          <Reveal>
            <WaveMask src="/images/hero/hero2.jpg" alt="富士山と五重塔" variant="B" priority />
          </Reveal>
        </div>
      </section>
      <section className="sec" id="form">
        <div className="wrap">
          <div className="formbox">
            <Reveal as="p" className="lead">
              {contactForm.heading}
            </Reveal>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
