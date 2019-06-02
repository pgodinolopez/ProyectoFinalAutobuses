import { Linea } from './linea';

export class Horario {
    idlinea: string;
    codigo: string;
    horas: string[];
    dias: string;
    observaciones: string;
    demandahoras: string;
    hora_salida: string;
    hora_llegada: string;
    operadores: string;
    precio_billete_sencillo: number;
    precio_tarjeta: number;
    tiempo_estimado: string;
    pmr: boolean;
    linea: Linea;
    origen: string;
    destino: string;

}