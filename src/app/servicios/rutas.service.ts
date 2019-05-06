import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Horario } from '../modelos/horario';
import { Linea } from '../modelos/linea';
import { Municipio } from '../modelos/municipio';
import { Nucleo } from '../modelos/nucleo';
import { Bloque } from '../modelos/bloque';

@Injectable({
  providedIn: 'root'
})
export class RutasService {
  
  // 1: http://api.ctan.es/v1/Consorcios/7/municipios/
  // 2: Líneas por municipio y por modo (autobús) http://api.ctan.es/v1/Consorcios/7/municipios/10/lineas?idModo=1
  // 3: Núcleos de un municipio http://api.ctan.es/v1/Consorcios/7/municipios/10/nucleos

  origen: string = '';
  destino: string = '';
  url_base = 'http://api.ctan.es/v1/Consorcios/7';
  url_horarios_lineas = '';
  url_información_lineas = this.url_base + '/lineas/';

  constructor(private http: HttpClient) { 
    
  }

  // getMunicipios() {
  //   return this.http.get<Municipio[]>(this.url_base + '/municipios/');
  // }

  getNucleos() {
    return this.http.get<Nucleo[]>(this.url_base + '/nucleos');
  }


  getHorarios(iDdestino: number, idOrigen: number) {
    return this.http.get<Horario[]>(this.url_base + '/horarios_origen_destino?destino=' + iDdestino + '&lang=ES&origen=' + idOrigen);
  }

  getDatosLineaPorId(idlinea: number) {
    return this.http.get<Linea>(this.url_información_lineas + idlinea);
  }

  obtenerBloquesDePasoPorIdLinea(idlinea: number) {
    return this.http.get<Bloque>(this.url_base + '/lineas/' + idlinea + '/bloques?sentido=1');
  }

}
