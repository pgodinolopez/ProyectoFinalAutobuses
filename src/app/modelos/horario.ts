import { Linea } from './linea';

export class Horario {
    idlinea: string;
    codigo: string;
    horas: string[];
    dias: string;
    observaciones: string;
    demandahoras: string;
    horaSalida: string;
    horaLlegada: string;
    operadores: string;
    precio_billete_sencillo: number;
    pmr: boolean;
    linea: Linea;
    horaSalidaDate: Date;
}