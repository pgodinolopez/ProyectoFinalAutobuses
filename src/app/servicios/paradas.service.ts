import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Parada } from '../modelos/parada';

@Injectable({
  providedIn: 'root'
})
export class ParadasService {

  // <preference name="GOOGLE_MAPS_ANDROID_API_KEY" value="AIzaSyA0vbcUiHwjbDcJYXj94bXpT1bWo927KLg" />
  // Obtener paradas: http://api.ctan.es/v1/Consorcios/7/paradas
  
  url_base = 'http://api.ctan.es/v1/Consorcios/7';

  constructor(private http: HttpClient) { }

  getParadas() {
    return this.http.get<Parada[]>(this.url_base + '/paradas');
  }

  getDatosParada(idParada: number) {
    return this.http.get<Parada>(this.url_base + '/paradas/' + idParada);
  }

}
