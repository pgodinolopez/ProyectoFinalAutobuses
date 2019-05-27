import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Horario } from '../modelos/horario';
import { Linea } from '../modelos/linea';
import { Municipio } from '../modelos/municipio';
import { Nucleo } from '../modelos/nucleo';
import { Bloque } from '../modelos/bloque';
import { retry } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RutasService {
  
  // 1: http://api.ctan.es/v1/Consorcios/7/municipios/
  // 2: Líneas por municipio y por modo (autobús) http://api.ctan.es/v1/Consorcios/7/municipios/10/lineas?idModo=1
  // 3: Núcleos de un municipio http://api.ctan.es/v1/Consorcios/7/municipios/10/nucleos
  // Saltos: http://api.ctan.es/v1/Consorcios/7/calculo_saltos?destino=46&origen=1
  // Tarifas: http://api.ctan.es/v1/Consorcios/7/tarifas_interurbanas
  
  origen: string = '';
  destino: string = '';
  url_base = 'http://api.ctan.es/v1/Consorcios/7';
  url_horarios_lineas = '';
  url_información_lineas = this.url_base + '/lineas/';
  horario: Horario;
  url_base_api_rest = 'http://127.0.0.1:8000/api/v1';
  url_rutas_favoritas = this.url_base_api_rest + '/rutas_favoritas';

  constructor(private http: HttpClient) { 
    
  }

  // getMunicipios() {
  //   return this.http.get<Municipio[]>(this.url_base + '/municipios/');
  // }

  getNucleos() {
    return this.http.get<Nucleo[]>(this.url_base + '/nucleos').pipe(retry(5));;
  }


  getHorarios(iDdestino: number, idOrigen: number) {
    return this.http.get<Horario[]>(this.url_base + '/horarios_origen_destino?destino=' + iDdestino + '&lang=ES&origen=' + idOrigen).pipe(retry(5));
  }

  getDatosLineaPorId(idlinea: number) {
    return this.http.get<Linea>(this.url_información_lineas + idlinea).pipe(retry(5));
    // return new Promise((resolve, reject) => {
    //   this.http.get<Linea>(this.url_información_lineas + idlinea)
    //     .subscribe(
    //      data => {
    //       resolve(data)
    //     },
    //      error => {
    //       reject(error);
    //     },
    //     );
    // });
  }

  getSaltosEntreNucleos(idNucleoDestino: number, idNucleoOrigen: number) {
    return this.http.get(this.url_base + '/calculo_saltos?destino=' + idNucleoDestino + '&origen=' + idNucleoOrigen).pipe(retry(5));
  }

  obtenerBloquesDePasoPorIdLinea(idlinea: number) {
    return this.http.get<Bloque>(this.url_base + '/lineas/' + idlinea + '/bloques?sentido=1');
  }

  getTarifas() {
    return this.http.get(this.url_base + '/tarifas_interurbanas').pipe(retry(5));
  }

  getHorarioDetalle() {
    return this.horario;
  }

  setHorarioDetalle(horario: Horario) {
    this.horario = horario;
  }

  getRutasFavoritas(token: string) {
    return this.http.get<Horario[]>(this.url_rutas_favoritas, {headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token}});
  }

  postRutaFavorita(token: string, horario: Horario) {
    console.log(token)
    return this.http.post<Horario>(this.url_rutas_favoritas, horario, {headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token}});
  }

}
