/**
 * Cloudinary & Image URL Optimization Utility
 * Automatically injects Cloudinary transformations (f_auto, q_auto, width resizing)
 * or serves modern webp alternatives for local images.
 */

export function optimizeImage(url, options = {}) {
  if (!url || typeof url !== "string") {
    return url;
  }

  const { width, quality = "auto", format = "auto" } = options;

  // 1. Cloudinary optimization
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    // Avoid double transformation
    if (
      url.includes("/upload/f_auto") ||
      url.includes("/upload/q_auto") ||
      /\/upload\/[^/]+,/.test(url)
    ) {
      return url;
    }

    const transforms = [`f_${format}`, `q_${quality}`];
    if (width) {
      transforms.push(`w_${width}`);
    }

    return url.replace("/upload/", `/upload/${transforms.join(",")}/`);
  }

  // 2. Local public images: use WebP if available
  if (url.startsWith("/") || url.startsWith("./")) {
    if (url.endsWith(".png") || url.endsWith(".jpg") || url.endsWith(".jpeg")) {
      const webpCandidate = url.replace(/\.(png|jpe?g)$/i, ".webp");
      return webpCandidate;
    }
  }

  return url;
}

export default optimizeImage;
