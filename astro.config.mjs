import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import caddy from "./src/caddyfile.tmLanguage.json";

export default defineConfig({
  site: "https://misterorion.com",
  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gg-4zior.b-cdn.net",
      },
    ],
  },
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: "github-dark-dimmed",
      langs: [
        "bash",
        caddy,
        "docker",
        "go",
        "json",
        "jsx",
        "powershell",
        "python",
        "sh",
        "shell",
        "yaml",
      ],
      wrap: true,
    },
  },
});
