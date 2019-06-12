import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Parada } from '../modelos/parada';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ParadasService {
  
  url_base = 'http://api.ctan.es/v1/Consorcios/7';

  constructor(private http: HttpClient) { }

  getParadas() {
    return new Promise((resolve, reject) => {
      this.http.get<Parada>(this.url_base + '/paradas').pipe(retry(5))
        .subscribe(
         data => {
          resolve(data)
        },
         error => {
          reject(error);
        },
        );
    });
  }

  getDatosParada(idParada: number) {
    return new Promise((resolve, reject) => {
      this.http.get<Parada>(this.url_base + '/paradas/' + idParada).pipe(retry(5))
        .subscribe(
         data => {
          resolve(data)
        },
         error => {
          reject(error);
        },
        );
    });
  }
}
