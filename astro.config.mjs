import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://utilix-62i.pages.dev",
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
});
