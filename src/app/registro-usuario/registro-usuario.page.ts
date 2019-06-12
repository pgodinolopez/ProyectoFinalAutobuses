import { Component, OnInit } from '@angular/core';
import { Usuario } from '../modelos/usuario';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { reduce } from 'rxjs/operators';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.page.html',
  styleUrls: ['./registro-usuario.page.scss'],
})
export class RegistroUsuarioPage implements OnInit {

  usuario: Usuario = new Usuario('', '', '', '');
  toast: any;

  constructor(private autenticationService: AutenticacionService, private router: Router, public toastController: ToastController) { }

  ngOnInit() {
  }

  registrar_usuario() {
    let regexEmail = /[\w-\.]{2,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/;
    let regextlfn = /^[9|6|7][0-9]{8}$/;
    if (!regexEmail.test(this.usuario._email)) {
      this.mostrarToastEmail();
    } else if (!regextlfn.test(this.usuario._telefono)) {
      this.mostrarToastTelefono();
    } else {
        this.usuario._token_dispositivo = 'aaaaa';
        this.autenticationService.registrarUsuario(this.usuario);
        this.router.navigate(['/tabs/login']);
    }
  }
  
  mostrarToastFire() {
    this.toast = this.toastController.create({
      message: this.usuario._token_dispositivo,
      duration: 2000,
      color: 'dark'
    }).then((toastData)=>{
      console.log(toastData);
      toastData.present();
    });
  }

  mostrarToastEmail() {
    this.toast = this.toastController.create({
      message: 'Correo electrónico mal formado',
      duration: 2000,
      color: 'dark'
    }).then((toastData)=>{
      console.log(toastData);
      toastData.present();
    });
  }
  mostrarToastTelefono() {
    this.toast = this.toastController.create({
      message: 'Teléfono incorrecto',
      duration: 2000,
      color: 'dark'
    }).then((toastData)=>{
      console.log(toastData);
      toastData.present();
    });
  }
  
}
