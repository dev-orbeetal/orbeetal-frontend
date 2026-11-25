"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ShowcaseCarousel from "@/components/ui/ShowcaseCarousel";
import { useGetPublishedClientsQuery } from "@/redux/features/cms/clientsApi";
import SectionShell from "@/components/layouts/SectionShell";

export default function ClientSection({ surface = "bg-pale" }) {
  const { data: clients = [], isLoading, isError, refetch } =
    useGetPublishedClientsQuery();

  return (
    <section className={`section showcase-section ${surface}`}>
      <SectionShell>
        <SectionHeading
          eyebrow="Our Clients"
          title={
            <>
              Trusted by{" "}
              <span className="text-gradient">Forward-Thinking Brands</span>
            </>
          }
          subtitle="We're proud to partner with organizations that trust us to build their most important digital products."
        />

        {isLoading && (
          <p className="section-stack flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
            <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
            Loading clients…
          </p>
        )}

        {isError && (
          <div className="card section-stack mx-auto max-w-lg p-8 text-center">
            <p className="font-semibold text-ink-900">Could not load clients.</p>
            <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && clients.length === 0 && (
          <p className="section-stack text-center text-sm font-semibold text-ink-500">
            Clients will appear here once they are published.
          </p>
        )}

        {clients.length > 0 && (
          <ShowcaseCarousel
            className="section-stack client-carousel"
            items={clients}
            getKey={(item) => item.id}
            label="client brands"
            size="compact"
            renderItem={(client) => {
              const linked = Boolean(client.url);
              const Tag = linked ? "a" : "div";
              return (
                <Tag
                  className="showcase-carousel-card client-logo"
                  aria-label={client.name}
                  {...(linked
                    ? {
                        href: client.url,
                        target: "_blank",
                        rel: "noopener noreferrer",
                      }
                    : {})}
                >
                  <span className="client-logo-mark">
                    {client.logo ? (
                      <Image
                        src={client.logo}
                        alt=""
                        fill
                        sizes="88px"
                        className="object-contain p-2.5"
                      />
                    ) : (
                      <span aria-hidden>{client.name?.slice(0, 1)}</span>
                    )}
                  </span>
                  <span className="client-logo-name" aria-hidden>
                    {client.name}
                  </span>
                </Tag>
              );
            }}
          />
        )}
      </SectionShell>
    </section>
  );
}
