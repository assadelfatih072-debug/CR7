export type Question = {
  id: number;
  q: string;
  o: string[];
  a: number; // Index of the correct option
};

export type GameState = 'start' | 'playing' | 'finished';
