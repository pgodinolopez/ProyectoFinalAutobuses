import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../modelos/usuario';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  // url_base = 'http://127.0.0.1:8000/api';
  url_base = 'http://192.168.0.161:8000/api';
  url_login = this.url_base + '/login_check';
  url_registro = this.url_base + '/register';

  token: string = '';
  
  constructor(private http: HttpClient) {
    
  }

  autenticarUsuario(usuario: Usuario) {
    return this.http.post<Usuario>(this.url_login, usuario, {headers: {'Content-Type': 'application/json'}});
  }

  registrarUsuario(usuario: Usuario) {
    return this.http.post<Usuario>(this.url_registro, usuario, {headers: {'Content-Type': 'application/json'}}).subscribe();
  }

  setToken(token: string) {
    this.token = token;
    console.log(this.token)
  }

  getToken() {
    console.log(this.token)
    return this.token;
  }

}
