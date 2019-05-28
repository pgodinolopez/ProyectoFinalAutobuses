import { Component, OnInit } from '@angular/core';
import { RutasService } from '../servicios/rutas.service';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Horario } from '../modelos/horario';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-rutas-favoritas',
  templateUrl: './rutas-favoritas.page.html',
  styleUrls: ['./rutas-favoritas.page.scss'],
})
export class RutasFavoritasPage {

  listaHorarios: Horario[];
  token: string = '';
  toast: any;

  constructor(private rutasService: RutasService, private autenticacionService: AutenticacionService, private router: Router, private storage: Storage, public toastController: ToastController) { }

  ionViewDidEnter() {
    let token = this.storage.get('token').then(
      (token) => {
        this.token = token.token;
        if (token.token!=null) {
          this.obtenerRutasFavoritas(token.token);
        } else {
          this.router.navigate(['/tabs/login']);
        }
      }
    );
  }

  obtenerRutasFavoritas(token: string) {
    this.rutasService.getRutasFavoritas(token).subscribe(
      (respuesta)=>{
        console.log(respuesta)
        this.listaHorarios = respuesta['data'];     
      }, error => {
      console.log('error', error['error']);
      if (error['error']['message']=="Expired JWT Token") {
        let token = {
          'token': this.token,
          'valido': false
        }
        this.storage.set('token', token);
        this.router.navigate(['/tabs/login']);
        this.mostrarToast('La sesion actual ha caducado');
      } 
    });
  }

  mostrarToast(mensaje: string) {
    this.toast = this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: 'dark'
    }).then((toastData)=>{
      console.log(toastData);
      toastData.present();
    });
  }

}
