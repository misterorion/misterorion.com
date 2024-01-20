import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import caddy from "./src/caddyfile.tmLanguage.json";

export default defineConfig({
  site: "https://misterorion.com",
  integrations: [mdx(), react(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: "github-dark-dimmed",
      langs: [
        'bash',
        caddy,
        'docker',
        'go',
        'json',
        'jsx',
        'powershell',
        'python',
        'sh',
        'shell',
        'yaml',
      ],
      wrap: true,
    },
  },
});
