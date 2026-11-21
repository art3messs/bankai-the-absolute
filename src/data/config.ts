export interface PhotoMemory {
  id: string;
  url: string;
  caption?: string;
  category: "all" | "aesthetic" | "travel" | "silly" | "core";
  date?: string;
}

export const BIRTHDAY_CONFIG = {
  recipientName: "Harleen",
  nickname: "Pucchi",
  birthDate: {
    day: 16,
    month: "February",
    monthIndex: 1, // 0-indexed (Feb = 1)
  },
  theme: {
    baseColor: "cream-pearl",       // 60% Silk Cream & Pearl Milk (#fbf7f8)
    secondaryColor: "rose-strawberry", // 30% Strawberry Rose Pink (#ff758f / #ff4d6d)
    accentColor: "champagne-gold",  // 10% Sparkling Champagne Gold (#f59e0b / #fde047)
    vibe: "dreamy-editorial",
  },
  spotifyPlaylistUrl: "https://open.spotify.com/playlist/06Aj93NfdzlxVX8Sw1dlXK?si=ae1e54085bc14b13&pt=434eda748460ab71160e13914df66af0",
  music: {
    title: "K.",
    artist: "Cigarettes After Sex",
    src: "/music/track.mp3",
  },
  letter: {
    title: "To Harleen, My Entire Universe & My Sweetest Pucchi 🌙",
    subtitle: "February 16 • A Love Letter Written From The Depths of My Heart",
    body: `Hey Harleen, Happy Birthday my favorite person. 🤍

I didn't want to make anything ordinary for you today, because in a world of billions of people, you are the most extraordinarily rare and beautiful soul to ever exist. You are genuinely, undeniably, the center of my entire universe.

More than anything in this life, seeing you truly happy is my greatest joy. Every little smile of yours, that soft quiet laugh when you're being silly, the way your eyes crinkle when you're giggling, and the effortless peace you bring into my chaotic world—nothing else compares.

Whenever things get heavy, just hearing your voice or getting a message from you makes everything feel gentle again. You are my safest haven, my sweetest comfort, my little Pucchi, and the person I want to celebrate every single day.

From your royal elegance in traditional silk to your adorable goofy faces, from your aesthetic nail checks to the baby pogo moments—every single version of you is something I treasure with all my heart.

May this 16th of February bring you the exact same warmth, tenderness, and endless love that you effortlessly give to me. May your upcoming year be full of sunshine, golden skies, laughter that hurts your stomach, and every dream you've ever whispered into the night.

Harleen 4 Life. Today, tomorrow, across every lifetime.

Happy Birthday, my beautiful girl. ✨🤍`,
    signoff: "Forever yours, and only yours,",
  },
  secretVault: {
    question: "What is that one secret code word that belongs only to you and me?",
    hint: "The cutest, softest little word... starts with 'p' 💋",
    answerHash: "pucchi",
    secretMessage: "You unlocked my secret vault! 🔐 'Pucchi' forever and always. You are genuinely the most precious, gorgeous, and adored person in this entire world, Harleen. My universe begins and ends with you. Happy Birthday, my love 🤍✨",
  },
  samplePhotos: [
    {
      id: "1",
      url: "/media/harleen-red-feather-dress.jpg",
      caption: "A vision in red • Pure elegance & grace 🌹",
      category: "aesthetic",
      date: "February 2026",
    },
    {
      id: "2",
      url: "/media/ethnic-dragonfly-tiara.jpg",
      caption: "Royal emerald tiara • Timeless queen 👑",
      category: "aesthetic",
      date: "February 2026",
    },
    {
      id: "3",
      url: "/media/harleen-warm-hug.jpg",
      caption: "Where my heart feels safest & warmest 🤍",
      category: "core",
      date: "Core Memory",
    },
    {
      id: "4",
      url: "/media/popaaa-cheek-pinch.jpg",
      caption: "Pucchi moments & the sweetest squishy giggles 🧸",
      category: "silly",
      date: "Late Night",
    },
    {
      id: "5",
      url: "/media/harleen-polka-rhinestones.jpg",
      caption: "Polka dots & rhinestone sparkles in your eyes ✨",
      category: "aesthetic",
      date: "Adored",
    },
    {
      id: "6",
      url: "/media/pogo-baby-fur-smile.jpg",
      caption: "Baby Pogo • The sweetest human since day one 🍼",
      category: "silly",
      date: "Forever",
    },
  ] as PhotoMemory[],
};
