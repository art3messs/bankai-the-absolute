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

export interface BirthdayDetails {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  upcomingYear: number;
  turningAge: number;
  daysRemaining: number;
  formattedDate: string;
}

export const BIRTHDAY_CONFIG = {
  event: {
    recipientName: "Harleen",
    nickname: "Pucchi",
    birthDate: "2008-02-16",
    timeZone: "Asia/Kolkata",
  },
  recipientName: "Harleen",
  nickname: "Pucchi",
  theme: {
    baseColor: "#fdf2f8",       // Softest Blossom Cream
    primaryColor: "#4a044e",    // Deep Royal Plum Berry
    secondaryColor: "#db2777",  // Blushing Petal Rose
    accentColor: "#fbbf24",     // Champagne Gold Starlight
    cardBg: "#ffffff",
  },
  spotifyPlaylistUrl: "https://open.spotify.com/playlist/06Aj93NfdzlxVX8Sw1dlXK",
  spotifyPlaylistId: "06Aj93NfdzlxVX8Sw1dlXK",
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
    hint: "Used to say before going to bed, kinda like mwahhh or so... 🌙",
    secretMessage: "You unlocked my secret vault! 🔐 'Pucchi' forever and always. You are genuinely the most precious, gorgeous, and adored person in this entire universe, Harleen. Seeing you happy is my whole world. Happy Birthday! 🤍✨",
  },
  samplePhotos: [
    {
      id: "1",
      url: "/media/harleen-red-feather-dress.jpg",
      caption: "A vision in red • Pure elegance & grace 🌹",
      category: "aesthetic",
      date: "February",
    },
    {
      id: "2",
      url: "/media/ethnic-dragonfly-tiara.jpg",
      caption: "Royal emerald tiara • Timeless queen 👑",
      category: "aesthetic",
      date: "February",
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

const STATIC_REFERENCE_DATE = new Date("2026-11-22T00:00:00+05:30");

export function getBirthdayDetails(referenceDate?: Date): BirthdayDetails {
  const [bYear, bMonth, bDay] = BIRTHDAY_CONFIG.event.birthDate.split("-").map(Number);
  const now = referenceDate || STATIC_REFERENCE_DATE;

  let currentYear = now.getFullYear();
  let currentMonth = now.getMonth() + 1;
  let currentDay = now.getDate();

  try {
    const kolkataFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: BIRTHDAY_CONFIG.event.timeZone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    const parts = kolkataFormatter.formatToParts(now);
    currentYear = Number(parts.find((p) => p.type === "year")?.value || currentYear);
    currentMonth = Number(parts.find((p) => p.type === "month")?.value || currentMonth);
    currentDay = Number(parts.find((p) => p.type === "day")?.value || currentDay);
  } catch {}

  let nextBirthdayYear = currentYear;
  if (currentMonth > bMonth || (currentMonth === bMonth && currentDay >= bDay)) {
    nextBirthdayYear = currentYear + 1;
  }

  const turningAge = nextBirthdayYear - bYear;
  const nextBirthdayDate = new Date(`${nextBirthdayYear}-02-16T00:00:00+05:30`);
  const diffTime = nextBirthdayDate.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  return {
    birthYear: bYear,
    birthMonth: bMonth,
    birthDay: bDay,
    upcomingYear: nextBirthdayYear,
    turningAge,
    daysRemaining,
    formattedDate: `${bDay} February`,
  };
}
