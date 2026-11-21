export interface PhotoMemory {
  id: string;
  url: string;
  caption?: string;
  category: "all" | "aesthetic" | "travel" | "silly" | "core";
  date?: string;
}

export interface SongTrack {
  id: string;
  title: string;
  artist: string;
  src: string;
  cover: string;
  quote: string;
  duration: string;
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
    baseColor: "#fdf2f8",       // Softest Blossom Cream
    primaryColor: "#4a044e",    // Deep Royal Plum Berry
    secondaryColor: "#db2777",  // Blushing Petal Rose
    accentColor: "#fbbf24",     // Champagne Gold Starlight
    cardBg: "#ffffff",
  },
  spotifyPlaylistUrl: "https://open.spotify.com/playlist/06Aj93NfdzlxVX8Sw1dlXK?si=ae1e54085bc14b13&pt=434eda748460ab71160e13914df66af0",
  music: {
    title: "K.",
    artist: "Cigarettes After Sex",
    src: "/music/track.mp3",
    cover: "/media/harleen-red-feather-dress.jpg",
  },
  playlist: [
    {
      id: "track-1",
      title: "K.",
      artist: "Cigarettes After Sex",
      src: "/music/track.mp3",
      cover: "/media/harleen-red-feather-dress.jpg",
      quote: "Remember when I started crying to you... Harleen 4 Life.",
      duration: "5:17",
    },
    {
      id: "track-2",
      title: "Royal Jhumkas Melody",
      artist: "Traditional Acoustic Soul",
      src: "/music/ethnic-glam.mp3",
      cover: "/media/ethnic-dragonfly-tiara.jpg",
      quote: "Emerald tiara and royal grace... Pure timeless poetry.",
      duration: "0:08",
    },
    {
      id: "track-3",
      title: "Red Silk Starlight",
      artist: "Cinematic Mood Track",
      src: "/music/red-silk.mp3",
      cover: "/media/vid-red-silk-reveal-poster.jpg",
      quote: "Dressed in starlight, turning heads without even trying.",
      duration: "0:09",
    },
    {
      id: "track-4",
      title: "Late Night Whispers",
      artist: "Intimate Keepsake Audio",
      src: "/music/whispers.mp3",
      cover: "/media/harleen-warm-hug.jpg",
      quote: "Sweetest sleepy conversations that make everything soft.",
      duration: "0:11",
    },
    {
      id: "track-5",
      title: "Magenta Lehenga Symphony",
      artist: "Festive Night Acoustic",
      src: "/music/magenta-lehenga.mp3",
      cover: "/media/vid-magenta-lehenga-night-poster.jpg",
      quote: "Dancing lights, soft smiles, and golden midnight laughter.",
      duration: "0:03",
    },
    {
      id: "track-6",
      title: "Leopard Elegance",
      artist: "Effortless Vibe",
      src: "/music/leopard-lookback.mp3",
      cover: "/media/vid-leopard-lookback-poster.jpg",
      quote: "That playful look over the shoulder... 1000/10.",
      duration: "0:03",
    },
  ] as SongTrack[],
  letter: {
    title: "To Harleen, The Sweetest Soul In My Universe 🌙",
    subtitle: "February 16 • Written From The Depths of My Heart",
    body: `Hey Harleen, Happy Birthday to my favorite human in the world. 🤍

I didn't want to make anything ordinary for you today, because in a world of billions of people, you are the most extraordinarily rare, gentle, and radiant person I know. You are genuinely, undeniably, the center of my entire universe.

More than anything in this life, seeing you truly happy is my favorite thing. Every smile of yours, that quiet laugh when you're being goofy, the way your eyes crinkle when you giggle, and the effortless peace you bring into my chaotic days—nothing else compares.

Whenever things get heavy, just hearing your voice or getting a message from you makes everything feel gentle again. You are my safest corner, my sweetest comfort, my little Pucchi, and someone I cherish with all my heart.

From your royal elegance in traditional silk to your adorable goofy faces, from your aesthetic nail checks to the baby pogo moments—every single version of you brings so much warmth into this world.

May this 16th of February give back even a fraction of the immense joy and comfort that you effortlessly give to everyone around you. May your days be soft, full of warm golden sunlight, and overflowing with endless peace.

Harleen 4 Life. Today, tomorrow, across every lifetime.

Happy Birthday, Harleen. ✨🤍`,
    signoff: "Forever yours with all my heart,",
  },
  secretVault: {
    question: "What is that one secret code word that belongs only to you and me?",
    hint: "used to say before going to bed, kinda like mwahhh or so",
    answerHash: "pucchi",
    secretMessage: "You unlocked my secret vault! 🔐 'Pucchi' forever and always. You are genuinely the most precious, gorgeous, and adored person in this entire universe, Harleen. Seeing you happy is my whole world. Happy Birthday! 🤍✨",
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
