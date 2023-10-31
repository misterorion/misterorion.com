import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://misterorion.com",
  integrations: [mdx(), react(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: "github-dark-dimmed",
      langs: [
        'bash',
        {
          id: "caddy",
          scopeName: "source.Caddyfile",
          path: "../../src/caddyfile.tmLanguage.json",
        },
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
      // Enable word wrap to prevent horizontal scrolling
      wrap: true,
    },
  },
  // markdown: {
  //   shikiConfig: {
  //     theme: "github-dark-dimmed",
  //     langs: [
  //       {
  //         id: "caddy",
  //         scopeName: "source.Caddyfile",
  //         path: "../../src/caddyfile.tmLanguage.json",
  //       },
  //     ],
  //   },
  // },
});
