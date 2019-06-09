import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../modelos/usuario';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  // url_base = 'http://127.0.0.1:8000/api';
  url_base = 'http://busapp-crta.000webhostapp.com/public/index.php/api';
  url_login = this.url_base + '/login_check';
  url_registro = this.url_base + '/register';

  token: string = '';
  
  constructor(private http: HttpClient, private http_advanced: HTTP) {
    
  }

  autenticarUsuario(usuario: Usuario) {
      this.http_advanced.setSSLCertMode('nocheck');
      this.http_advanced.setHeader('*', 'Access-Control-Allow-Origin' , '*');
      this.http_advanced.setHeader('*', 'Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
      this.http_advanced.setHeader('*', 'Accept','application/json');
      this.http_advanced.setHeader('*', 'content-type','application/json');
      this.http_advanced.setDataSerializer('json');
      return this.http_advanced.post(this.url_login, usuario, {});
    
  }

  registrarUsuario(usuario: Usuario) {
    this.http_advanced.setSSLCertMode('nocheck');
    this.http_advanced.setHeader('*', 'Access-Control-Allow-Origin' , '*');
    this.http_advanced.setHeader('*', 'Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    this.http_advanced.setHeader('*', 'Accept','application/json');
    this.http_advanced.setHeader('*', 'content-type','application/json');
    this.http_advanced.setDataSerializer('json');
    return this.http_advanced.post(this.url_registro, usuario, {}).then();
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
