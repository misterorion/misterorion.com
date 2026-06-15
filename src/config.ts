export const site = {
  url: "https://misterorion.com",
  title: "Orion Anderson",
  author: "Orion Anderson",
  description: "My personal home on the web.",
  image: "/images/enso.jpg",
  userFirstName: "Orion",
  userLastName: "Anderson",
  userTwitter: "MisterOrion",
  userGitHub: "MisterOrion",
  userLinkedIn: "orionanderson",
  userReddit: "soldatz",
  bunnyDomain: "gg-4zior.b-cdn.net",
  mainMenu: [
    {
      name: "Writing",
      slug: "/writing/",
    },
  ],
};

export const socials = [
  {
    name: "GitHub",
    url: `https://github.com/${site.userGitHub}`,
    enabled: true,
    svgPath: "/src/images/icons/icons8-octocat-32.svg",
  },
  {
    name: "LinkedIn",
    url: `https://www.linkedin.com/in/${site.userLinkedIn}`,
    enabled: true,
    svgPath: "/src/images/icons/icons8-linkedin-32.svg",
  },
  {
    name: "Reddit",
    url: `https://www.reddit.com/user/${site.userReddit}`,
    enabled: true,
    svgPath: "/src/images/icons/icons8-reddit-32.svg",
  },
  {
    name: "X",
    url: `https://x.com/${site.userTwitter}`,
    enabled: true,
    svgPath: "/src/images/icons/icons8-x-32.svg",
  },
];
