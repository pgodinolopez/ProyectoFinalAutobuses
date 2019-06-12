import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Horario } from '../modelos/horario';
import { Linea } from '../modelos/linea';
import { Nucleo } from '../modelos/nucleo';
import { retry } from 'rxjs/operators';
import { HTTP } from '@ionic-native/http/ngx';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RutasService {
  
  url_base = 'http://api.ctan.es/v1/Consorcios/7';
  url_información_lineas = this.url_base + '/lineas/';
  horario: Horario;
  url_base_api_rest = 'http://busapp-crta.000webhostapp.com/public/index.php/api/v1';
  url_rutas_favoritas = this.url_base_api_rest + '/rutas_favoritas';
  url_api_directions = 'https://maps.googleapis.com/maps/api/directions/json?';

  constructor(private http: HttpClient, private http_advanced: HTTP) { 
    
  }

  getNucleos() {
    return this.http.get<Nucleo[]>(this.url_base + '/nucleos').pipe(retry(5));;
  }


  getHorarios(iDdestino: number, idOrigen: number) {
    return this.http.get<Horario[]>(this.url_base + '/horarios_origen_destino?destino=' + iDdestino + '&lang=ES&origen=' + idOrigen).pipe(retry(5));
  }

  getDatosLineaPorId(idlinea: number) {
    return this.http.get<Linea>(this.url_información_lineas + idlinea).pipe(retry(5));
  }

  getSaltosEntreNucleos(idNucleoDestino: number, idNucleoOrigen: number) {
    return this.http.get(this.url_base + '/calculo_saltos?destino=' + idNucleoDestino + '&origen=' + idNucleoOrigen).pipe(retry(5));
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
    this.http_advanced.setSSLCertMode('nocheck');
    this.http_advanced.setHeader('*', 'Access-Control-Allow-Origin' , '*');
    this.http_advanced.setHeader('*', 'Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    this.http_advanced.setHeader('*', 'Accept','application/json');
    this.http_advanced.setHeader('*', 'Authorization','Bearer ' + token);
    this.http_advanced.setHeader('*', 'content-type','application/json');
    this.http_advanced.setDataSerializer('json');
    return this.http_advanced.get(this.url_rutas_favoritas, {}, {});
  }

  postRutaFavorita(token: string, horario: Horario) {
    this.http_advanced.setSSLCertMode('nocheck');
    this.http_advanced.setHeader('*', 'Access-Control-Allow-Origin' , '*');
    this.http_advanced.setHeader('*', 'Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    this.http_advanced.setHeader('*', 'Accept','application/json');
    this.http_advanced.setHeader('*', 'Authorization','Bearer ' + token);
    this.http_advanced.setHeader('*', 'content-type','application/json');
    this.http_advanced.setDataSerializer('json');
    return this.http_advanced.post(this.url_rutas_favoritas, horario, {});
  }

  // deleteRutaFavorita(token: string, id: number) {
  //   this.http_advanced.setSSLCertMode('nocheck');
  //   this.http_advanced.setHeader('*', 'Access-Control-Allow-Origin' , '*');
  //   this.http_advanced.setHeader('*', 'Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
  //   this.http_advanced.setHeader('*', 'Authorization','Bearer ' + token);
  //   this.http_advanced.setDataSerializer('json');
  //   return this.http_advanced.delete(this.url_rutas_favoritas + '/' + id, {}, {});
  // }

  // 000webhost no permite métodos DELETE

  deleteRutaFavorita(token: string, id: number) {
    this.http_advanced.setSSLCertMode('nocheck');
    this.http_advanced.setHeader('*', 'Access-Control-Allow-Origin' , '*');
    this.http_advanced.setHeader('*', 'Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    this.http_advanced.setHeader('*', 'Accept','application/json');
    this.http_advanced.setHeader('*', 'Authorization','Bearer ' + token);
    this.http_advanced.setDataSerializer('json');
    return this.http_advanced.post(this.url_rutas_favoritas + '/' + id, {}, {});
  }

  getPolylineDirectionsApi(latitudOrigen: number, longitudOrigen: number, latitudDestino: number, longitudDestino: number) {
    return this.http_advanced.get(this.url_api_directions + 'origin=' + latitudOrigen + ',' + longitudOrigen + 
    '&destination=' + latitudDestino + ',' + longitudDestino + '&key=AIzaSyBfG3ZD45duCVpztkuld3Aoy8UZ5XOao80', {}, {});
  }

  getGeoCodefromGoogleAPI(address: string): Observable<any> {
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyDV4JB4N-neOVZ9p0lqta66XaWkWHBBcEY')
  }

}
