export interface PhotoMemory {
  id: string;
  url: string;
  caption?: string;
  category: "all" | "aesthetic" | "travel" | "silly" | "core";
  date?: string;
}

export const BIRTHDAY_CONFIG = {
  recipientName: "Harleen",
  nickname: "Harlee",
  birthDate: {
    day: 16,
    month: "February",
    monthIndex: 1, // 0-indexed (Feb = 1)
  },
  theme: {
    baseColor: "obsidian",      // 60% Noir Charcoal & Deep Indigo (#0a080d)
    secondaryColor: "dusty-rose", // 30% Cashmere Blush & Dusty Mauve (#e0a4b8)
    accentColor: "champagne-gold",// 10% Luminous Champagne Gold (#fde047 / #ffe3a8)
    vibe: "cigarettes-after-sex-cinematic",
  },
  spotifyPlaylistUrl: "https://open.spotify.com/track/1FWWonnv3kdOzvo7AZBZu8",
  music: {
    title: "K.",
    artist: "Cigarettes After Sex",
    src: "/music/track.mp3",
  },
  letter: {
    title: "For Harleen, at Midnight 🌙",
    subtitle: "February 16 • An intimate letter for someone truly rare",
    body: `Hey Harleen, Happy Birthday. 🤍

I didn't want to make something ordinary for you. I wanted to build a world that feels just like you—rare, effortlessly beautiful, and unforgettable.

There is a quiet grace in the way you laugh, the way you speak, and the way you make the simplest moments feel like scenes from a movie you never want to end. In a world full of noise, you bring an effortless peace.

May this 16th of February be gentle to you, filled with warm golden lights, soft laughter, and all the love you give so freely to others.

Thank you for existing, Harleen.

Happy Birthday, always. ✨`,
    signoff: "Yours in quiet admiration,",
  },
  secretVault: {
    question: "Where did we first talk or what is our favorite inside joke?",
    hint: "Think about our iconic memory together...",
    answerHash: "pink",
    secretMessage: "You unlocked the midnight vault. Some memories will always belong to only the two of us 🤍✨",
  },
  samplePhotos: [
    {
      id: "1",
      url: "/photos/sample1.jpg",
      caption: "Golden hour glow & that effortless smile ✨",
      category: "aesthetic",
      date: "February 2026",
    },
    {
      id: "2",
      url: "/photos/sample2.jpg",
      caption: "Unfiltered laughter on late night talks 🌙",
      category: "core",
      date: "Late Night",
    },
    {
      id: "3",
      url: "/photos/sample3.jpg",
      caption: "The silliest memories stay forever 😂",
      category: "silly",
      date: "Moments",
    },
  ] as PhotoMemory[],
};
