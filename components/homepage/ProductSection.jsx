"use client";

import { Loader2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import DragRail from "@/components/ui/DragRail";
import FeatureTile from "@/components/ui/FeatureTile";
import { useGetPublishedProductsQuery } from "@/redux/features/cms/productsApi";
import SectionShell from "@/components/layouts/SectionShell";

function productImage(product) {
  return product.imageScreen || product.image || "";
}

export default function ProductShowcase({ surface = "bg-pale" }) {
  const { data: products = [], isLoading, isError, refetch } =
    useGetPublishedProductsQuery();
  return (
    <section className={`section showcase-section ${surface}`}>
      <SectionShell>
        <SectionHeading
          eyebrow="Orbeetal Originals"
          title={
            <>
              Our Company <span className="text-gradient">Products</span>
            </>
          }
          subtitle="Battle-tested products we designed, built, and shipped — proof of what we can deliver for you."
        />

        {isLoading && (
          <p className="section-stack flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
            <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
            Loading products…
          </p>
        )}

        {isError && (
          <div className="card section-stack mx-auto max-w-lg p-8 text-center">
            <p className="font-semibold text-ink-900">Could not load products.</p>
            <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && products.length === 0 && (
          <p className="section-stack text-center text-sm font-semibold text-ink-500">
            Products will appear here once they are published.
          </p>
        )}

        {products.length > 0 && (
          <DragRail
            className="section-stack"
            items={products}
            getKey={(item) => item.id}
            label="company products"
            size="feature"
            autoplay
            renderItem={(product, index) => (
              <FeatureTile
                image={productImage(product)}
                title={product.title}
                badge={`${String(index + 1).padStart(2, "0")} / Product`}
                description={product.description}
                features={product.features}
                href={product.url || "/portfolio"}
                external={Boolean(product.url)}
                priority={index === 0}
              />
            )}
          />
        )}
      </SectionShell>
    </section>
  );
}
