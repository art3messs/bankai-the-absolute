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
    primaryColor: "pink",
    vibe: "romantic-fairytale",
  },
  spotifyPlaylistUrl: "https://open.spotify.com",
  music: {
    title: "Her Favorite Song",
    artist: "Special Track",
    src: "/music/track.mp3",
  },
  letter: {
    title: "To the Prettiest Girl in Pink 🌸",
    subtitle: "A little letter from the heart on your 16th of February",
    body: `Hey Harleen, Happy Birthday!! 🌸✨

I wanted to make something truly special and one-of-a-kind for your birthday—a little digital universe dedicated entirely to you. You deserve all the beauty, laughter, and pink flowers in the world today.

Every memory, every funny joke, and every moment captured here is a reminder of how lucky the world is to have you. Your smile lights up every room, your style is unmatched, and your vibe is genuinely unforgettable.

May this 16th of February bring you endless happiness, beautiful surprises, and the sweetest memories ahead.

Happy Birthday once again, Harleen! 🤍🌸`,
    signoff: "Forever admiring you,",
  },
  secretVault: {
    question: "Where did we first talk or what is our favorite inside joke?",
    hint: "Think about our iconic memory together...",
    answerHash: "pink",
    secretMessage: "You unlocked the secret memory vault! Here's to making 10,000 more memories together 💖",
  },
  samplePhotos: [
    {
      id: "1",
      url: "/photos/sample1.jpg",
      caption: "That iconic pink outfit 🎀",
      category: "aesthetic",
      date: "Feb 2026",
    },
    {
      id: "2",
      url: "/photos/sample2.jpg",
      caption: "Unmatched laughter & golden hour ✨",
      category: "core",
      date: "Spring 2026",
    },
    {
      id: "3",
      url: "/photos/sample3.jpg",
      caption: "Silliest moments are the best ones 😂",
      category: "silly",
      date: "Summer 2026",
    },
  ] as PhotoMemory[],
};
