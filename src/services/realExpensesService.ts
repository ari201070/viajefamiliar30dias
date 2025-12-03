/**
 * Real Expenses Service
 * Provides access to actual trip expenses from gastos-reales.ts
 */

import { gastosReales, resumenTotales, gastosPorCiudad } from '../../Documentos/gastos-reales';

export interface RealExpensesSummary {
  alojamiento: number;
  transporte: number;
  comida: number;
  actividades: number;
  compras: number;
  total: number;
}

/**
 * Get summary of all real expenses by category
 */
export const getRealExpensesSummary = (): RealExpensesSummary => {
  return resumenTotales;
};

/**
 * Get expenses breakdown by city
 */
export const getRealExpensesByCity = () => {
  return gastosPorCiudad;
};

/**
 * Get all transactions
 */
export const getAllTransactions = () => {
  return gastosReales;
};

/**
 * Mapping of budget translation keys to real expense categories
 * This maps the conceptKey from budgetItems to the category in gastosReales
 */
export const CATEGORY_KEY_MAPPING: Record<string, keyof RealExpensesSummary> = {
  'accommodation_budget': 'alojamiento',
  'food_budget': 'comida',
  'transport_budget': 'transporte',
  'activities_budget': 'actividades',
  'international_flights_budget': 'transporte',
  'domestic_flights_budget': 'transporte',
  'budget_transport_local': 'transporte',
};

/**
 * Cities where family stayed for free (no accommodation expenses)
 */
export const FREE_ACCOMMODATION_CITIES = [
  'buenosaires', // Initial stay
  'rosario',
  'buenosaires_final', // Final stay
];

/**
 * Check if a city has free accommodation
 */
export const hasFreeAccommodation = (cityId: string): boolean => {
  return FREE_ACCOMMODATION_CITIES.includes(cityId);
};
