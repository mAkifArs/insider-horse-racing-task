import { Horse } from "../types/horse";

/**
 * Predefined horse names (19 names provided)
 */
const HORSE_NAMES = [
  "Gülbatur",
  "Bold Pilot",
  "Karayel",
  "Sergen Yalçin",
  "Turbo",
  "Yavuzhan",
  "Özgünhan",
  "Caş",
  "Hizlitay",
  "Demirklir",
  "Altaha",
  "Sakarya",
  "Şahinkaya",
  "Baturşah",
  "Karaüzüm",
  "Kafkasli",
  "Aslankaya",
  "Yildirimhan",
  "Bozkurt",
] as const;

/**
 * Predefined unique colors for horses (20 colors for 20 horses)
 */
const HORSE_COLORS = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#FFA07A", // Light Salmon
  "#98D8C8", // Mint
  "#F7DC6F", // Yellow
  "#BB8FCE", // Purple
  "#85C1E2", // Sky Blue
  "#F8B739", // Orange
  "#52BE80", // Green
  "#EC7063", // Coral
  "#5DADE2", // Light Blue
  "#F1948A", // Pink
  "#82E0AA", // Light Green
  "#F4D03F", // Gold
  "#AF7AC5", // Lavender
  "#76D7C4", // Turquoise
  "#F5B041", // Amber
  "#E74C3C", // Dark Red
  "#3498DB", // Bright Blue
] as const;

/**
 * Generate a random number between min and max (inclusive)
 */
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generate a unique ID for a horse
 */
const generateHorseId = (index: number): string => {
  return `horse_${index + 1}`;
};

/**
 * Generate all 20 horses with predefined names
 * Ensures each horse has a unique color
 */
export const generateHorses = (): Horse[] => {
  const names = [...HORSE_NAMES];

  // We have 19 names, need 20 horses - add one more name
  const allNames = names.length < 20 ? [...names, "Thunder"] : names;

  // Shuffle colors array to randomize color assignment
  const shuffledColors = [...HORSE_COLORS].sort(() => Math.random() - 0.5);

  // Generate 20 horses with unique names and colors
  return allNames.slice(0, 20).map((name, index) => ({
    id: generateHorseId(index),
    name,
    condition: randomInt(1, 100),
    color: shuffledColors[index],
  }));
};

/**
 * Get horse by ID
 */
export const getHorseById = (
  horses: Horse[],
  id: string
): Horse | undefined => {
  return horses.find((horse) => horse.id === id);
};

/**
 * Get horses by IDs
 */
export const getHorsesByIds = (horses: Horse[], ids: string[]): Horse[] => {
  return ids
    .map((id) => getHorseById(horses, id))
    .filter((horse): horse is Horse => horse !== undefined);
};
