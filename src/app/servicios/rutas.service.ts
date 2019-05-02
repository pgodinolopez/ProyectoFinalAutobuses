import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Horario } from '../modelos/horario';
import { Linea } from '../modelos/linea';

@Injectable({
  providedIn: 'root'
})
export class RutasService {

  origen: string = '';
  destino: string = '';
  url_base = 'http://api.ctan.es/v1/Consorcios/7';
  url_horarios_lineas = '';
  url_información_lineas = this.url_base + '/lineas/';

  constructor(private http: HttpClient) { 
    
  }

  setOrigen(origen: string) {
    this.origen = origen;
    console.log(origen);
  }

  setDestino(destino: string) {
    this.destino = destino;
  }

  getHorarios() {
    return this.http.get<Horario[]>(this.url_horarios_lineas);
  }

  getDatosLineaPorId(idlinea: number) {
    return this.http.get<Linea>(this.url_información_lineas + idlinea);
  }

  construirUrl() {
    this.url_horarios_lineas = this.url_base + '/horarios_origen_destino?destino=' + this.destino + '&lang=ES&origen=' + this.origen;
  }

  construirUrlInfo() {

  }

}
