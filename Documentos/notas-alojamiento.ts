/**
 * Notas Importantes sobre Alojamientos y Gastos Especiales
 * 
 * ALOJAMIENTOS SIN CARGO EN ESTADO DE CUENTA:
 * - Buenos Aires (26-30 Sep): Casa de familia
 * - Rosario (30 Sep - 04 Oct): Casa de familia  
 * - Buenos Aires Final (26-28 Oct): Casa de familia
 * 
 * ALOJAMIENTOS CON RESERVA CONFIRMADA:
 * - Salta (15-19 Oct): Urquiza Suites
 * 
 * GASTOS PENDIENTES DE REVISIÓN:
 * - MERPAGO*DELAROSAGU (22/10): ARS 968,704 = USD 2,280.36
 * - TRAMAT SA Y OTROS (múltiples fechas): Naturaleza del servicio
 * - Bariloche CONCORDE pago 02/10 vs. estadía 05/10: Verificar si es adelanto
 */

export const notasAlojamiento = {
  sinCargo: [
    {
      ciudad: 'Buenos Aires',
      fechas: '26-30 Sep 2025',
      razon: 'Casa de familia',
      dias: 4
    },
    {
      ciudad: 'Rosario',
      fechas: '30 Sep - 04 Oct 2025',
      razon: 'Casa de familia',
      dias: 4
    },
    {
      ciudad: 'Buenos Aires',
      fechas: '26-28 Oct 2025',
      razon: 'Casa de familia',
      dias: 2
    }
  ],
  conReserva: [
    {
      ciudad: 'Salta',
      fechas: '15-19 Oct 2025',
      alojamiento: 'Urquiza Suites',
      dias: 4,
      monto: 'USD 314.38',
      nota: '✅ Confirmado - Agregado a gastos-reales.ts'
    }
  ]
};

export const gastosPendientesRevision = [
  {
    fecha: '22/10/25',
    comercio: 'MERPAGO*DELAROSAGU',
    monto: 'ARS 968,704 (USD 671.02)',
    categoria: '✅ RESUELTO: Transporte',
    descripcion: 'Transfer Privado 4x4 Iguazú → Esteros Iberá (9h, Arasari traslados y excursiones)'
  },
  {
    comercio: 'TRAMAT SA Y OTROS',
    ocurrencias: 2,
    montoTotal: 'ARS 308,800 (USD 746.24)',
    categoria: '✅ RESUELTO: Actividades en Bariloche',
    descripcion: 'Actividades turísticas en Bariloche'
  },
  {
    fecha: '02/10/25',
    comercio: 'CONCORDE HOTEL BARILOCHE',
    monto: 'ARS 228,200',
    nota: 'Pago el 02/10 pero estadía planificada 05-10/10',
    pregunta: '⏳ PENDIENTE: ¿Es pago adelantado o cambió la fecha de estadía?'
  }
];
