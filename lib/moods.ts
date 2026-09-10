// TMDB genre IDs reference (from /genre/movie/list):
// 28 Action | 12 Adventure | 16 Animation | 35 Comedy | 80 Crime
// 99 Documentary | 18 Drama | 10751 Family | 14 Fantasy | 36 History
// 27 Horror | 10402 Music | 9648 Mystery | 10749 Romance
// 878 Science Fiction | 10770 TV Movie | 53 Thriller | 10752 War | 37 Western

export type Mood = {
  id: string;
  label: string;
  emoji: string;
  genreIds: number[];
  // optional discover filters layered on top of genre match
  filters?: {
    voteAverageGte?: number;
    runtimeLte?: number;
    runtimeGte?: number;
  };
};

export const MOODS: Mood[] = [
  {
    id: "cozy-sunday",
    label: "Cozy Sunday",
    emoji: "☕",
    genreIds: [10751, 35], // Family, Comedy
    filters: { voteAverageGte: 6.5, runtimeLte: 110 },
  },
  {
    id: "popcorn-chaos",
    label: "Popcorn Chaos",
    emoji: "💥",
    genreIds: [28, 12], // Action, Adventure
    filters: { voteAverageGte: 6.0 },
  },
  {
    id: "existential-dread",
    label: "Existential Dread",
    emoji: "🌀",
    genreIds: [18, 878], // Drama, Science Fiction
    filters: { voteAverageGte: 7.0 },
  },
  {
    id: "edge-of-seat",
    label: "Edge of Your Seat",
    emoji: "😬",
    genreIds: [53, 9648], // Thriller, Mystery
  },
  {
    id: "curl-up-scared",
    label: "Curl Up Scared",
    emoji: "🕯️",
    genreIds: [27], // Horror
    filters: { voteAverageGte: 6.0 },
  },
  {
    id: "swept-away",
    label: "Swept Away",
    emoji: "💌",
    genreIds: [10749, 18], // Romance, Drama
  },
  {
    id: "big-brain",
    label: "Big Brain Energy",
    emoji: "🧠",
    genreIds: [99, 36], // Documentary, History
    filters: { voteAverageGte: 6.5 },
  },
  {
    id: "escape-reality",
    label: "Escape Reality",
    emoji: "🪄",
    genreIds: [14, 16], // Fantasy, Animation
  },
  {
    id: "outlaw-hour",
    label: "Outlaw Hour",
    emoji: "🤠",
    genreIds: [80, 37], // Crime, Western
  },
  {
    id: "heavy-heart",
    label: "Heavy Heart",
    emoji: "🕊️",
    genreIds: [10752, 18], // War, Drama
    filters: { voteAverageGte: 7.0 },
  },
];

// Usage: build a TMDB /discover/movie query, e.g.
// with_genres=${genreIds.join(",")}&vote_average.gte=${filters.voteAverageGte}
