// src/utils/colombiaData.ts

export type DepartamentoItem = {
    departamento: string
    ciudades: string[]
}

/**
 * Dataset Colombia (departamentos + ciudades principales).
 * Nota: NO incluye los 1.100+ municipios (eso sería un JSON grande),
 * pero sí trae una base bastante completa para ecommerce.
 */
export const departamentos: DepartamentoItem[] = [
    { departamento: 'Amazonas', ciudades: ['Leticia', 'Puerto Nariño'] },
    { departamento: 'Antioquia', ciudades: ['Medellín', 'Bello', 'Itagüí', 'Envigado', 'Rionegro', 'Apartadó', 'Turbo', 'Sabaneta', 'La Estrella', 'Copacabana'] },
    { departamento: 'Arauca', ciudades: ['Arauca', 'Saravena', 'Tame', 'Arauquita'] },
    { departamento: 'Atlántico', ciudades: ['Barranquilla', 'Soledad', 'Malambo', 'Puerto Colombia', 'Sabanalarga', 'Baranoa'] },
    { departamento: 'Bogotá D.C.', ciudades: ['Bogotá D.C.'] },

    { departamento: 'Bolívar', ciudades: ['Cartagena', 'Turbaco', 'Arjona', 'Magangué', 'El Carmen de Bolívar', 'Mompox'] },
    { departamento: 'Boyacá', ciudades: ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá', 'Paipa', 'Puerto Boyacá'] },
    { departamento: 'Caldas', ciudades: ['Manizales', 'Villamaría', 'Chinchiná', 'La Dorada'] },
    { departamento: 'Caquetá', ciudades: ['Florencia', 'San Vicente del Caguán', 'Puerto Rico'] },
    { departamento: 'Casanare', ciudades: ['Yopal', 'Aguazul', 'Villanueva', 'Tauramena'] },
    { departamento: 'Cauca', ciudades: ['Popayán', 'Santander de Quilichao', 'Puerto Tejada'] },
    { departamento: 'Cesar', ciudades: ['Valledupar', 'Aguachica', 'Codazzi', 'La Jagua de Ibirico'] },
    { departamento: 'Chocó', ciudades: ['Quibdó', 'Istmina', 'Tadó'] },
    { departamento: 'Córdoba', ciudades: ['Montería', 'Cereté', 'Lorica', 'Sahagún', 'Planeta Rica'] },

    { departamento: 'Cundinamarca', ciudades: ['Soacha', 'Chía', 'Zipaquirá', 'Facatativá', 'Girardot', 'Fusagasugá', 'Mosquera', 'Funza', 'Madrid', 'Cajicá', 'La Calera'] },
    { departamento: 'Guainía', ciudades: ['Inírida'] },
    { departamento: 'Guaviare', ciudades: ['San José del Guaviare'] },
    { departamento: 'Huila', ciudades: ['Neiva', 'Pitalito', 'Garzón', 'La Plata', 'Campoalegre', 'Palermo', 'Gigante'] },
    { departamento: 'La Guajira', ciudades: ['Riohacha', 'Maicao', 'Uribia', 'Fonseca', 'San Juan del Cesar'] },
    { departamento: 'Magdalena', ciudades: ['Santa Marta', 'Ciénaga', 'Fundación', 'El Banco'] },
    { departamento: 'Meta', ciudades: ['Villavicencio', 'Acacías', 'Granada', 'Puerto López'] },

    { departamento: 'Nariño', ciudades: ['Pasto', 'Ipiales', 'Tumaco', 'La Unión'] },
    { departamento: 'Norte de Santander', ciudades: ['Cúcuta', 'Ocaña', 'Pamplona', 'Villa del Rosario'] },
    { departamento: 'Putumayo', ciudades: ['Mocoa', 'Puerto Asís', 'Orito', 'Sibundoy'] },

    { departamento: 'Quindío', ciudades: ['Armenia', 'Calarcá', 'Montenegro', 'Quimbaya'] },
    { departamento: 'Risaralda', ciudades: ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal', 'La Virginia'] },
    { departamento: 'San Andrés y Providencia', ciudades: ['San Andrés', 'Providencia'] },

    { departamento: 'Santander', ciudades: ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Barrancabermeja', 'San Gil'] },
    { departamento: 'Sucre', ciudades: ['Sincelejo', 'Corozal', 'Sampués'] },
    { departamento: 'Tolima', ciudades: ['Ibagué', 'Espinal', 'Honda', 'Melgar', 'Chaparral'] },

    { departamento: 'Valle del Cauca', ciudades: ['Cali', 'Palmira', 'Buenaventura', 'Tuluá', 'Jamundí', 'Yumbo', 'Cartago', 'Buga'] },
    { departamento: 'Vaupés', ciudades: ['Mitú'] },
    { departamento: 'Vichada', ciudades: ['Puerto Carreño'] },
]

/** Helpers para usarlo igual en cualquier componente */
export const getCiudadesByDepartamento = (departamento: string) =>
    departamentos.find((d) => d.departamento === departamento)?.ciudades ?? []

export const departamentosList = departamentos.map((d) => d.departamento)
