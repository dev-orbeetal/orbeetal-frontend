import Header from "@/components/banner/Header";
import PageHero from "@/components/layouts/PageHero";
import FAQSection from "@/components/faq/FAQSection";
import React from "react";

export const metadata = {
  title: "FAQ — Orbeetal",
  description:
    "Answers to common questions about working with Orbeetal.",
};

function FAQPage() {
  return (
    <main>
      <Header />
      <PageHero
        eyebrow="Help Center"
        title="Frequently asked"
        highlight="questions"
        subtitle="Quick answers to the questions we hear most. Still curious? Our team is one message away."
        crumb="FAQ"
      />
      <FAQSection />
    </main>
  );
}

export default FAQPage;
