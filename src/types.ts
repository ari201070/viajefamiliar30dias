export enum Language {
  ES = 'es',
  HE = 'he',
}

export enum Currency {
  ARS = 'ARS',
  USD = 'USD',
  EUR = 'EUR',
  ILS = 'ILS',
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export interface PointOfInterest {
  id: string;
  nameKey: string;
  coords: [number, number];
  descriptionKey?: string;
}

export interface BudgetItem {
  conceptKey: string; // e.g., 'budget_concept_accommodation'
  value: string;      // e.g., '50-120' - The value is stored directly here
  isPerDay: boolean;  // To help with calculations
}

export interface City {
  id: string;
  nameKey: string; // Translation key for the name
  coords: [number, number];
  image: string; // Path to image, e.g., /docs/imagenes/buenosaires.jpg
  descriptionKey: string;
  activitiesKey: string;
  accommodationKey: string;
  budgetItems: BudgetItem[]; // Replaces budgetKey
  pointsOfInterest?: PointOfInterest[]; // Optional array of POIs
}

export interface Day {
  id: number;
  dayNumber: number;
  cityId: string; // links to a City
  titleKey: string;
  descriptionKey: string;
  image: string;
}

export interface TranslationSet {
  [key:string]: string;
}

export interface Translations {
  [Language.ES]: TranslationSet;
  [Language.HE]: TranslationSet;
}

export interface AppContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  t: (key: string, replacements?: Record<string, string>) => string;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export interface PolygonRateResponse {
  status?: string;
  request_id?: string;
  ticker?: string;
  results?: { c: number }[]; 
  error?: string;
}

export interface TransportLeg {
  id: string;
  fromKey: string;
  toKey: string;
  meanKey: string;
  timeKey: string;
  priceKey: string; 
  company: string;
  basePriceARS: number;
  companyUrlKey?: string; // Optional: translation key for the company's URL
}

export interface AIPromptContent {
  titleKey: string;
  descriptionKey: string;
  buttonKey: string;
  promptKeySuffix: string; // e.g., 'ai_prompt_menu' -> cityId + promptKeySuffix
  icon: string; // FontAwesome icon class
  userInputPlaceholderKey: string; // Placeholder for the user input textarea
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  originalLang: Language;
  translations?: Partial<Record<Language, string>>;
}

export interface PackingItem {
  id: string;
  text: string;
  type: 'essential' | 'optional';
  originalLang: Language;
}

// Types for Grounding / Google Search Tool
export interface WebChunk {
  web: {
    uri: string;
    title: string;
  };
}

export type GroundingChunk = WebChunk; // Can be extended if other chunk types are used

export interface AIResponseType {
  text: string;
  lang: Language;
  originalBasePromptKey: string;
  originalUserInput: string;
  sources?: GroundingChunk[];
}

export interface EditableBudgetItem {
  id: string; // uuid for stable keys
  concept: string; // e.g., "Estadía en Buenos Aires" or "Transporte: BUE -> ROS"
  details: string; // e.g., "4 días" or "Bus"
  dates: string; // e.g., "27/09 - 30/09"
  estimatedCost: number; // Stored in ARS for consistency
  actualCost: number | null; // User-editable
  notes: string; // User-editable
}

export interface BudgetDetails {
  total: string;
  breakdown: Record<string, string>;
  isCalculating: boolean;
}