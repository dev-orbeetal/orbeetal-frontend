function cleanSource(value) {
  if (typeof value !== "string") return "";
  const source = value.trim();
  if (!source || source.includes("logo-small")) return "";
  return source;
}

export function projectImages(project) {
  if (!project) return [];
  const related = [project.supervisor, project.partner, project.organization].map(
    (item) => item?.image
  );
  const explicit = Array.isArray(project.images) ? project.images : [];
  const sources = [...explicit, project.image, ...related];
  const seen = new Set();
  const images = [];
  for (const value of sources) {
    const source = cleanSource(value);
    if (!source || seen.has(source)) continue;
    seen.add(source);
    images.push(source);
  }
  return images;
}

export function imageFit(src) {
  const path = String(src || "").split("?")[0].toLowerCase();
  if (path.endsWith(".svg") || path.includes("logo")) return "contain";
  return "cover";
}
