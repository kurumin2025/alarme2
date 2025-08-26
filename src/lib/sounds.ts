export type Sound = {
  name: string;
  file: string; // a real app would use this for an audio file path
  note?: 'C4' | 'D4' | 'E4' | 'F4' | 'G4'; // For Tone.js synth fallback
};

export const defaultSounds: Sound[] = [
  { name: 'Ondas Suaves', file: 'ocean.mp3', note: 'C4' },
  { name: 'Chuva Leve', file: 'rain.mp3', note: 'D4' },
  { name: 'Pássaros da Manhã', file: 'birds.mp3', note: 'E4' },
  { name: 'Ruído Branco', file: 'whitenoise.mp3', note: 'F4' },
  { name: 'Sinos Suaves', file: 'bells.mp3', note: 'G4' },
];
