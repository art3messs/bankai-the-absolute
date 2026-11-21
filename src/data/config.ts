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
    title: "For Harleen, My Entire Universe 🌙",
    subtitle: "February 16 • Written straight from my heart",
    body: `Hey Harleen, Happy Birthday. 🤍

I didn't want to make anything ordinary for you today, because to me, you are the most extraordinary person in this world. You are genuinely the center of my entire universe.

More than anything in life, I just want to see you happy. Every smile of yours, every little laugh, the way you speak, and the effortless peace you bring into my world—it means more to me than words could ever explain.

In a world full of temporary things, having you in my life is something I will always cherish with everything I have. You are my favorite person, my safest corner, and the sweetest part of every day.

May this 16th of February give back even a fraction of the immense joy you give to me. May your days be soft, full of warm golden light, and overflowing with endless peace.

Harleen 4 life, always and forever.

Happy Birthday, my favorite person in the entire universe. ✨`,
    signoff: "Yours, and only yours,",
  },
  secretVault: {
    question: "What is that one secret inside joke or memory that belongs only to you and me?",
    hint: "Think about the sweetest thing between us...",
    answerHash: "pink",
    secretMessage: "You unlocked my secret vault. You are my entire universe, and seeing you happy will always be my favorite thing in the world 🤍✨",
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
      caption: "Looking like pure royalty in soft rose 🎀",
      category: "aesthetic",
      date: "February 2026",
    },
    {
      id: "3",
      url: "/photos/sample3.jpg",
      caption: "The sweet laugh that makes the whole world stop 🕊️",
      category: "core",
      date: "Core Memory",
    },
    {
      id: "4",
      url: "/photos/sample4.jpg",
      caption: "Unfiltered laughter on late night talks 🌙",
      category: "core",
      date: "Late Night",
    },
    {
      id: "5",
      url: "/photos/sample5.jpg",
      caption: "The sweetest, cutest moments that belong only to us 🧸",
      category: "silly",
      date: "Adored",
    },
    {
      id: "6",
      url: "/photos/sample6.jpg",
      caption: "Harleen 4 Life • My entire universe forever 🤍",
      category: "aesthetic",
      date: "Forever",
    },
  ] as PhotoMemory[],
};
