import BrandLoader from "@/components/brand/BrandLoader";

export default function Loading() {
  return (
    <main className="route-loader" aria-busy="true">
      <BrandLoader id="route" />
    </main>
  );
}
