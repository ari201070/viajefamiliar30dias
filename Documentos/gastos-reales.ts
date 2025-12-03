/**
 * Gastos Reales del Viaje a Argentina
 * Extraído del estado de cuenta de tarjeta de crédito
 * Datos actualizados: Diciembre 2025
 */

export interface GastoReal {
  fecha: string; // Fecha de la transacción
  ciudad: string;
  comercio: string;
  montoOriginal: number;
  monedaOriginal: 'ARS' | 'USD' | 'EUR' | 'BRL' | 'ILS';
  montoUSD: number;
  fechaConversion: string;
  tasaCambioILS: number;
  comisionILS: number;
  montoNetoILS: number;
  montoCargadoILS: number;
  categoria: 'alojamiento' | 'transporte' | 'comida' | 'actividades' | 'compras' | 'otros';
}

export const gastosReales: GastoReal[] = [
  // ========== TRANSPORTE BUENOS AIRES → ROSARIO ==========
  {
    fecha: '29/09/25',
    ciudad: 'BUENOS AIRES',
    comercio: 'BUSBUD (Bus BA→Rosario, Boleto SUV-242355778-0, Butaca 27, Salida 30/09 13:30)',
    montoOriginal: 302.26,
    monedaOriginal: 'ILS',
    montoUSD: 77.87, // Aproximado basado en tasa ILS→USD
    fechaConversion: '30/09/25',
    tasaCambioILS: 3.8807,
    comisionILS: 7.95,
    montoNetoILS: 302.26,
    montoCargadoILS: 302.26,
    categoria: 'transporte'
  },

  // ========== BARILOCHE ==========
  {
    fecha: '02/10/25',
    ciudad: 'BARILOCHE',
    comercio: 'CONCORDE HOTEL',
    montoOriginal: 228200.00,
    monedaOriginal: 'ARS',
    montoUSD: 554.32,
    fechaConversion: '03/10/25',
    tasaCambioILS: 3.3150,
    comisionILS: 14.57,
    montoNetoILS: 162.82,
    montoCargadoILS: 554.32,
    categoria: 'alojamiento'
  },
  {
    fecha: '05/10/25',
    ciudad: 'BARILOCHE',
    comercio: 'CONCORDE HOTEL',
    montoOriginal: 456511.00,
    monedaOriginal: 'ARS',
    montoUSD: 1095.39,
    fechaConversion: '06/10/25',
    tasaCambioILS: 3.2810,
    comisionILS: 28.80,
    montoNetoILS: 325.08,
    montoCargadoILS: 1095.39,
    categoria: 'alojamiento'
  },
  {
    fecha: '05/10/25',
    ciudad: 'BARILOCHE',
    comercio: 'MERPAGO*LAESQUINA',
    montoOriginal: 45065.00,
    monedaOriginal: 'ARS',
    montoUSD: 108.13,
    fechaConversion: '06/10/25',
    tasaCambioILS: 3.2810,
    comisionILS: 2.84,
    montoNetoILS: 32.09,
    montoCargadoILS: 108.13,
    categoria: 'comida'
  },
  {
    fecha: '05/10/25',
    ciudad: 'PROV R NEGRO',
    comercio: 'ESPACIO SA',
    montoOriginal: 191000.00,
    monedaOriginal: 'ARS',
    montoUSD: 458.30,
    fechaConversion: '06/10/25',
    tasaCambioILS: 3.2810,
    comisionILS: 12.05,
    montoNetoILS: 136.01,
    montoCargadoILS: 458.30,
    categoria: 'actividades'
  },
  {
    fecha: '05/10/25',
    ciudad: 'BARILOCHE',
    comercio: 'TRAMAT SA Y OTROS (Actividad)',
    montoOriginal: 264000.00,
    monedaOriginal: 'ARS',
    montoUSD: 633.45,
    fechaConversion: '06/10/25',
    tasaCambioILS: 3.2810,
    comisionILS: 16.65,
    montoNetoILS: 187.99,
    montoCargadoILS: 633.45,
    categoria: 'actividades'
  },
  {
    fecha: '06/10/25',
    ciudad: 'BARILOCHE',
    comercio: 'EL BOLICHE DE ALBE',
    montoOriginal: 53600.00,
    monedaOriginal: 'ARS',
    montoUSD: 128.33,
    fechaConversion: '08/10/25',
    tasaCambioILS: 3.2790,
    comisionILS: 3.37,
    montoNetoILS: 38.11,
    montoCargadoILS: 128.33,
    categoria: 'comida'
  },

  // ========== ROSARIO / ENTRE RÍOS ==========
  {
    fecha: '02/10/25',
    ciudad: 'PROV E RIOS',
    comercio: 'PASAJES EN BUS',
    montoOriginal: 500000.00,
    monedaOriginal: 'ARS',
    montoUSD: 1214.56,
    fechaConversion: '05/10/25',
    tasaCambioILS: 3.3150,
    comisionILS: 31.93,
    montoNetoILS: 356.75,
    montoCargadoILS: 1214.56,
    categoria: 'transporte'
  },

  // ========== MENDOZA ==========
  {
    fecha: '11/10/25',
    ciudad: 'MENDOZA',
    comercio: 'HOTEL FUENTE MAYOR',
    montoOriginal: 283098.00,
    monedaOriginal: 'ARS',
    montoUSD: 712.75,
    fechaConversion: '13/10/25',
    tasaCambioILS: 3.2840,
    comisionILS: 18.74,
    montoNetoILS: 211.33,
    montoCargadoILS: 712.75,
    categoria: 'alojamiento'
  },
  {
    fecha: '11/10/25',
    ciudad: 'BARILOCHE',
    comercio: 'TRAMAT SA Y OTROS (Actividad)',
    montoOriginal: 44800.00,
    monedaOriginal: 'ARS',
    montoUSD: 112.79,
    fechaConversion: '13/10/25',
    tasaCambioILS: 3.2840,
    comisionILS: 2.97,
    montoNetoILS: 33.44,
    montoCargadoILS: 112.79,
    categoria: 'actividades'
  },
  {
    fecha: '12/10/25',
    ciudad: 'MENDOZA',
    comercio: 'FUENTE Y FONDA SA',
    montoOriginal: 58416.00,
    monedaOriginal: 'ARS',
    montoUSD: 147.09,
    fechaConversion: '13/10/25',
    tasaCambioILS: 3.2840,
    comisionILS: 3.87,
    montoNetoILS: 43.61,
    montoCargadoILS: 147.09,
    categoria: 'comida'
  },

  // ========== VUELO INTERNACIONAL (Boarding Passes) ==========
  {
    fecha: '14/10/25',
    ciudad: 'EN RUTA',
    comercio: 'TTN - Boarding Pass Y0HBMB59 (Vuelo Internacional)',
    montoOriginal: 5705.60,
    monedaOriginal: 'ILS',
    montoUSD: 1470.00, // Aproximado basado en tasa promedio
    fechaConversion: '16/10/25',
    tasaCambioILS: 1,
    comisionILS: 0,
    montoNetoILS: 5705.60,
    montoCargadoILS: 5705.60,
    categoria: 'transporte'
  },
  {
    fecha: '17/10/25',
    ciudad: 'EN RUTA',
    comercio: 'TTN - Ajuste/Reembolso Boarding Pass',
    montoOriginal: -274.40,
    monedaOriginal: 'ILS',
    montoUSD: -70.67,
    fechaConversion: '17/10/25',
    tasaCambioILS: 1,
    comisionILS: 0,
    montoNetoILS: -274.40,
    montoCargadoILS: -274.40,
    categoria: 'transporte'
  },

  // ========== SALTA/JUJUY ==========
  {
    fecha: '17/10/25',
    ciudad: 'PURMAMARCA',
    comercio: 'MERPAGO*KUNTURPARR',
    montoOriginal: 45750.00,
    monedaOriginal: 'ARS',
    montoUSD: 115.62,
    fechaConversion: '17/10/25',
    tasaCambioILS: 3.3240,
    comisionILS: 3.04,
    montoNetoILS: 33.87,
    montoCargadoILS: 115.62,
    categoria: 'actividades'
  },
  {
    fecha: '18/10/25',
    ciudad: 'SALTA',
    comercio: 'MERPAGO*ANDRESSANL',
    montoOriginal: 61982.25,
    monedaOriginal: 'ARS',
    montoUSD: 152.03,
    fechaConversion: '20/10/25',
    tasaCambioILS: 3.3110,
    comisionILS: 4.00,
    montoNetoILS: 44.71,
    montoCargadoILS: 152.03,
    categoria: 'comida'
  },
  {
    fecha: '15-19/10/25',
    ciudad: 'SALTA',
    comercio: 'URQUIZA SUITES',
    montoOriginal: 314.38,
    monedaOriginal: 'USD',
    montoUSD: 314.38,
    fechaConversion: 'N/A',
    tasaCambioILS: 0,
    comisionILS: 0,
    montoNetoILS: 0,
    montoCargadoILS: 0,
    categoria: 'alojamiento'
  },

  // ========== BUENOS AIRES ==========
  {
    fecha: '19/10/25',
    ciudad: 'BSAS',
    comercio: 'MERPAGO*CAMINITO',
    montoOriginal: 32500.00,
    monedaOriginal: 'ARS',
    montoUSD: 79.71,
    fechaConversion: '20/10/25',
    tasaCambioILS: 3.3110,
    comisionILS: 2.10,
    montoNetoILS: 23.44,
    montoCargadoILS: 79.71,
    categoria: 'actividades'
  },
  {
    fecha: '27/10/25',
    ciudad: 'CIUDAD AUTON',
    comercio: 'MERPAGO*ARGENTO',
    montoOriginal: 40150.00,
    monedaOriginal: 'ARS',
    montoUSD: 93.88,
    fechaConversion: '28/10/25',
    tasaCambioILS: 3.2590,
    comisionILS: 2.47,
    montoNetoILS: 28.05,
    montoCargadoILS: 93.88,
    categoria: 'comida'
  },
  {
    fecha: '28/10/25',
    ciudad: 'EST GOMEZ',
    comercio: 'ADIDAS ABASTO',
    montoOriginal: 44999.50,
    monedaOriginal: 'ARS',
    montoUSD: 104.24,
    fechaConversion: '29/10/25',
    tasaCambioILS: 3.2500,
    comisionILS: 2.74,
    montoNetoILS: 31.23,
    montoCargadoILS: 104.24,
    categoria: 'compras'
  },
  {
    fecha: '28/10/25',
    ciudad: 'PILAR',
    comercio: 'MERPAGO*TEQUELUNA',
    montoOriginal: 27000.00,
    monedaOriginal: 'ARS',
    montoUSD: 62.54,
    fechaConversion: '29/10/25',
    tasaCambioILS: 3.2500,
    comisionILS: 1.64,
    montoNetoILS: 18.74,
    montoCargadoILS: 62.54,
    categoria: 'comida'
  },
  {
    fecha: '28/10/25',
    ciudad: 'PILAR',
    comercio: 'PROPINA*TEQUELUNA',
    montoOriginal: 1350.00,
    monedaOriginal: 'ARS',
    montoUSD: 3.13,
    fechaConversion: '29/10/25',
    tasaCambioILS: 3.2500,
    comisionILS: 0.08,
    montoNetoILS: 0.94,
    montoCargadoILS: 3.13,
    categoria: 'comida'
  },

  // ========== IGUAZÚ ==========
  {
    fecha: '20/10/25',
    ciudad: 'IGUAZU',
    comercio: 'ALSULTAN EGO',
    montoOriginal: 29950.00,
    monedaOriginal: 'ARS',
    montoUSD: 70.45,
    fechaConversion: '22/10/25',
    tasaCambioILS: 3.2980,
    comisionILS: 1.85,
    montoNetoILS: 20.80,
    montoCargadoILS: 70.45,
    categoria: 'comida'
  },
  {
    fecha: '21/10/25',
    ciudad: 'FOZ DO IGUACU',
    comercio: 'URBIA CATARATAS S',
    montoOriginal: 260.75,
    monedaOriginal: 'BRL',
    montoUSD: 164.58,
    fechaConversion: '22/10/25',
    tasaCambioILS: 3.2980,
    comisionILS: 4.33,
    montoNetoILS: 48.59,
    montoCargadoILS: 164.58,
    categoria: 'actividades'
  },
  {
    fecha: '21/10/25',
    ciudad: 'FOZ DO IGUACU',
    comercio: 'URBIA CATARATAS SA',
    montoOriginal: 234.00,
    monedaOriginal: 'BRL',
    montoUSD: 147.71,
    fechaConversion: '22/10/25',
    tasaCambioILS: 3.2980,
    comisionILS: 3.88,
    montoNetoILS: 43.61,
    montoCargadoILS: 147.71,
    categoria: 'actividades'
  },
  {
    fecha: '21/10/25',
    ciudad: 'FOZ DO IGUACU',
    comercio: 'PARQUE DAS AVES',
    montoOriginal: 270.00,
    monedaOriginal: 'BRL',
    montoUSD: 170.44,
    fechaConversion: '22/10/25',
    tasaCambioILS: 3.2980,
    comisionILS: 4.48,
    montoNetoILS: 50.32,
    montoCargadoILS: 170.44,
    categoria: 'actividades'
  },
  {
    fecha: '21/10/25',
    ciudad: 'FOZ DO IGUACU',
    comercio: 'MACUCO SAFARI',
    montoOriginal: 768.00,
    monedaOriginal: 'BRL',
    montoUSD: 484.79,
    fechaConversion: '22/10/25',
    tasaCambioILS: 3.2980,
    comisionILS: 12.75,
    montoNetoILS: 143.13,
    montoCargadoILS: 484.79,
    categoria: 'actividades'
  },
  {
    fecha: '21/10/25',
    ciudad: 'FOZ DO IGUACU',
    comercio: 'TRES FRONTEIRAS NA',
    montoOriginal: 20.00,
    monedaOriginal: 'BRL',
    montoUSD: 12.63,
    fechaConversion: '22/10/25',
    tasaCambioILS: 3.2980,
    comisionILS: 0.33,
    montoNetoILS: 3.73,
    montoCargadoILS: 12.63,
    categoria: 'actividades'
  },
  {
    fecha: '21/10/25',
    ciudad: 'FOZ DO IGUACU',
    comercio: 'TRES FRONTEIRAS NA',
    montoOriginal: 20.00,
    monedaOriginal: 'BRL',
    montoUSD: 12.63,
    fechaConversion: '22/10/25',
    tasaCambioILS: 3.2980,
    comisionILS: 0.33,
    montoNetoILS: 3.73,
    montoCargadoILS: 12.63,
    categoria: 'actividades'
  },
  {
    fecha: '21/10/25',
    ciudad: 'IGUAZU',
    comercio: 'MERIT IGUAZU HOTEL',
    montoOriginal: 28700.00,
    monedaOriginal: 'ARS',
    montoUSD: 67.56,
    fechaConversion: '23/10/25',
    tasaCambioILS: 3.3090,
    comisionILS: 1.78,
    montoNetoILS: 19.88,
    montoCargadoILS: 67.56,
    categoria: 'alojamiento'
  },
  {
    fecha: '22/10/25',
    ciudad: 'IGUAZU',
    comercio: 'MERIT IGUAZU HOTEL',
    montoOriginal: 18000.00,
    monedaOriginal: 'ARS',
    montoUSD: 42.37,
    fechaConversion: '23/10/25',
    tasaCambioILS: 3.3090,
    comisionILS: 1.11,
    montoNetoILS: 12.47,
    montoCargadoILS: 42.37,
    categoria: 'alojamiento'
  },
  {
    fecha: '22/10/25',
    ciudad: 'PUERTO IGUAZU',
    comercio: 'MERPAGO*DELAROSAGU - Transfer Privado 4x4 Iguazú→Esteros Iberá (9h, Arasari)',
    montoOriginal: 968704.00,
    monedaOriginal: 'ARS',
    montoUSD: 671.02,
    fechaConversion: '23/10/25',
    tasaCambioILS: 3.3090,
    comisionILS: 59.95,
    montoNetoILS: 671.02,
    montoCargadoILS: 2280.36,
    categoria: 'transporte'
  },

  // ========== ESTEROS DEL IBERÁ ==========
  {
    fecha: '22/10/25',
    ciudad: 'MERCEDES',
    comercio: 'IRUPE LODGE Y TOUR',
    montoOriginal: 1444170.00,
    monedaOriginal: 'ARS',
    montoUSD: 3300.47,
    fechaConversion: '23/10/25',
    tasaCambioILS: 3.3090,
    comisionILS: 86.77,
    montoNetoILS: 971.20,
    montoCargadoILS: 3300.47,
    categoria: 'alojamiento'
  },

  // ========== POSADAS ==========
  {
    fecha: '22/10/25',
    ciudad: 'POSADAS',
    comercio: 'MC DONALDS',
    montoOriginal: 44200.00,
    monedaOriginal: 'ARS',
    montoUSD: 103.46,
    fechaConversion: '24/10/25',
    tasaCambioILS: 3.2900,
    comisionILS: 2.72,
    montoNetoILS: 30.62,
    montoCargadoILS: 103.46,
    categoria: 'comida'
  },

  // ========== CORRIENTES ==========
  {
    fecha: '25/10/25',
    ciudad: 'CORRIENTES',
    comercio: 'MERPAGO*PGCORRIENT',
    montoOriginal: 27000.00,
    monedaOriginal: 'ARS',
    montoUSD: 63.12,
    fechaConversion: '27/10/25',
    tasaCambioILS: 3.2590,
    comisionILS: 1.66,
    montoNetoILS: 18.86,
    montoCargadoILS: 63.12,
    categoria: 'comida'
  },
  {
    fecha: '25/10/25',
    ciudad: 'CORRIENTES',
    comercio: 'PREVISORA DEL PARA',
    montoOriginal: 115488.50,
    monedaOriginal: 'ARS',
    montoUSD: 269.32,
    fechaConversion: '29/10/25',
    tasaCambioILS: 3.2500,
    comisionILS: 7.08,
    montoNetoILS: 80.69,
    montoCargadoILS: 269.32,
    categoria: 'alojamiento'
  },

  // ========== VUELOS DOMÉSTICOS ==========
  {
    fecha: '26/10/25',
    ciudad: 'CAP.FEDERAL',
    comercio: 'FLYBONDI',
    montoOriginal: 12000.00,
    monedaOriginal: 'ARS',
    montoUSD: 28.05,
    fechaConversion: '28/10/25',
    tasaCambioILS: 3.2590,
    comisionILS: 0.74,
    montoNetoILS: 8.38,
    montoCargadoILS: 28.05,
    categoria: 'transporte'
  },
  {
    fecha: '26/10/25',
    ciudad: 'CAP.FEDERAL',
    comercio: 'FLYBONDI',
    montoOriginal: 81500.00,
    monedaOriginal: 'ARS',
    montoUSD: 190.58,
    fechaConversion: '28/10/25',
    tasaCambioILS: 3.2590,
    comisionILS: 5.01,
    montoNetoILS: 56.94,
    montoCargadoILS: 190.58,
    categoria: 'transporte'
  },

  // ========== ADDIS ABABA (ESCALA) ==========
  {
    fecha: '29/10/25',
    ciudad: 'ADDIS',
    comercio: 'SUNSHINE RETAIL PL',
    montoOriginal: 43.30,
    monedaOriginal: 'USD',
    montoUSD: 43.30,
    fechaConversion: '31/10/25',
    tasaCambioILS: 3.2430,
    comisionILS: 1.14,
    montoNetoILS: 13.00,
    montoCargadoILS: 43.30,
    categoria: 'compras'
  }
];

// ========== FUNCIONES DE ANÁLISIS ==========

export function calcularTotalPorCategoria(categoria: GastoReal['categoria']): number {
  return gastosReales
    .filter(g => g.categoria === categoria)
    .reduce((sum, g) => sum + g.montoUSD, 0);
}

export function calcularTotalPorCiudad(ciudad: string): number {
  return gastosReales
    .filter(g => g.ciudad.toLowerCase().includes(ciudad.toLowerCase()))
    .reduce((sum, g) => sum + g.montoUSD, 0);
}

export function obtenerGastosPorFecha(fechaInicio: string, fechaFin: string): GastoReal[] {
  return gastosReales.filter(g => {
    const fecha = g.fecha;
    return fecha >= fechaInicio && fecha <= fechaFin;
  });
}

export const resumenTotales = {
  alojamiento: calcularTotalPorCategoria('alojamiento'),
  transporte: calcularTotalPorCategoria('transporte'),
  comida: calcularTotalPorCategoria('comida'),
  actividades: calcularTotalPorCategoria('actividades'),
  compras: calcularTotalPorCategoria('compras'),
  otros: calcularTotalPorCategoria('otros'),
  get total() {
    return this.alojamiento + this.transporte + this.comida + 
           this.actividades + this.compras + this.otros;
  }
};

export const gastosPorCiudad = {
  bariloche: calcularTotalPorCiudad('bariloche'),
  mendoza: calcularTotalPorCiudad('mendoza'),
  salta: calcularTotalPorCiudad('salta') + calcularTotalPorCiudad('purmamarca'),
  iguazu: calcularTotalPorCiudad('iguazu') + calcularTotalPorCiudad('foz'),
  corrientes: calcularTotalPorCiudad('corrientes'),
  ibera: calcularTotalPorCiudad('mercedes'),
  buenosAires: calcularTotalPorCiudad('bsas') + calcularTotalPorCiudad('pilar'),
};
