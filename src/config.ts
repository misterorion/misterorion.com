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
  profile: {
    header: "Hey, I'm Orion",
    welcome: "Welcome to my home on the Web.",
    bio: "I'm a cloud infrastructure engineer and cybersecurity enthusiast living in NYC.",
    interests: ["classical music", "gaming", "sci-fi", "yoga"],
  },
  mainMenu: [
    {
      name: "Grimoire",
      slug: "/grimoire/",
    },
    {
      name: "About",
      slug: "/about/",
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
