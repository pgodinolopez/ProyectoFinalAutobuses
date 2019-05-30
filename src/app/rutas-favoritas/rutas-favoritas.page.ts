import { Component, OnInit } from '@angular/core';
import { RutasService } from '../servicios/rutas.service';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { Router } from '@angular/router';
import { ToastController, ActionSheetController } from '@ionic/angular';
import { Horario } from '../modelos/horario';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-rutas-favoritas',
  templateUrl: './rutas-favoritas.page.html',
  styleUrls: ['./rutas-favoritas.page.scss'],
})
export class RutasFavoritasPage {

  listaHorarios: Horario[];
  token: any = {
    'token': '',
    'valido': false,
  };
  toast: any;

  constructor(private rutasService: RutasService, private router: Router, 
    private storage: Storage, public toastController: ToastController,
    private actionSheetController: ActionSheetController) { }

  ionViewDidEnter() {
    let token = this.storage.get('token').then(
      (token) => {
        this.token = token;
        console.log(this.token)
        console.log(this.token.token)
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
          'token': this.token.token,
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

  async mostrarMenuUsuario() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Usuario',
      buttons: [{
        text: 'Cerrar Sesión',
        icon: 'power',
        handler: () => {
          this.token = {
            'token': '',
            'valido': false,
          };
          this.storage.set('token', this.token);
          this.router.navigate(['']);
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

  irDetalleRuta(horario) {
    horario['favorito'] = true;
    this.rutasService.setHorarioDetalle(horario);
    this.router.navigate(['/tabs/ver-rutas/ruta-detalle/' + horario.idlinea]);
  }

  irAPaginaLogin() {
    this.router.navigate(['/tabs/login']);
  }

}
