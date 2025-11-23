import type firebase from 'firebase/compat/app';

// User type from Firebase Auth
export type User = firebase.User;

// --- Enums ---
export enum Language {
  ES = 'es',
  HE = 'he',
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum Currency {
  USD = 'USD',
  ARS = 'ARS',
  EUR = 'EUR',
  ILS = 'ILS',
}

// --- App Context ---
export interface AppContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  t: (key: string, options?: any) => string;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isOnline: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  hasPendingPackingListChanges: boolean;
  setHasPendingPackingListChanges: (hasChanges: boolean) => void;
  pendingPhotos: PhotoItem[];
  setPendingPhotos: (photos: PhotoItem[]) => void;
}


// --- City and Points of Interest ---
export interface PointOfInterest {
  nameKey: string;
  descriptionKey: string;
  coords: [number, number];
}

export interface City {
  id: string;
  nameKey: string;
  descriptionKey: string;
  image: string;
  detailImage: string;
  coords: [number, number];
  budgetItems: BudgetItem[];
  pointsOfInterest: PointOfInterest[];
  activitiesKey: string;
  accommodationKey: string;
  startDate?: string; // AGREGAR ESTA LÍNEA
  endDate?: string;   // AGREGAR ESTA LÍNEA
}

// --- Budget ---
export interface BudgetItem {
  conceptKey: string;
  value: string; // Can be a single number or a range like "100-150"
  isPerDay: boolean;
}

export interface BudgetDetails {
  total: string;
  breakdown: Record<string, string>;
  isCalculating: boolean;
}

// --- AI and Chat ---
export interface AIPromptContent {
  icon: string;
  titleKey: string;
  descriptionKey: string;
  userInputPlaceholderKey: string;
  promptKeySuffix: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  originalLang: Language;
  translations: Record<string, string>;
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface AIResponseType {
  text: string;
  sources?: GroundingChunk[];
  lang: Language;
  originalBasePromptKey: string;
  originalUserInput: string;
}


// --- Transportation & Reservations ---
export interface Price {
  value: number;
  currency: Currency;
}

export interface TransportLeg {
  id: string;
  fromKey: string;
  toKey: string;
  meanKey: string;
  timeKey: string;
  basePriceARS: Price | number;
  company: string;
}

export interface HotelData {
  name: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  confirmation: string;
  pin: string;
  price: Price;
}

export interface BusData {
  company: string;
  departure: string;
  arrival: string;
  duration: string;
  passengers: { name: string; seat: string }[];
  price: Price;
}

export interface TransferData {
  from: string;
  to: string;
  date: string;
  duration: string;
  price: Price;
}

export interface BookingItem {
  id: string;
  type: 'hotel' | 'bus' | 'transfer';
  titleKey: string;
  descriptionKey: string;
  data: HotelData | BusData | TransferData;
}


// --- Packing List ---
export interface PackingItem {
  id: string;
  text: string;
  type: 'essential' | 'optional';
  originalLang: Language;
  checked: boolean;
}

// --- Photo Album ---
export interface PhotoItem {
  id: string;
  src: string;
  caption: string;
  originalLang: Language;
  dateTaken: string;
  tripDay: number;
  cityId: string;
}

// --- Weather ---
export interface CurrentWeather {
  temp: number;
  feels_like: number;
  humidity: number;
  description: string;
  icon: string;
}

export interface DailyForecast {
  dayOfWeek: string;
  date: string;
  temp_min: number;
  temp_max: number;
  description: string;
  icon: string;
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: DailyForecast[];
}