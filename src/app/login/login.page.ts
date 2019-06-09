import { Component, OnInit } from '@angular/core';
import { Usuario } from '../modelos/usuario';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usuario: Usuario = new Usuario('', '', '', '');;
  toast: any;

  constructor(private autenticacion_service: AutenticacionService, private router: Router, private storage: Storage, public toastController: ToastController) { 
    
  }

  ngOnInit() {
    let tokenInicial = this.storage.get('token').then(
      (token) => {
        if (token!=null && token.valido) {
          this.router.navigate(['/tabs/ver-rutas']);
        } else {
          
        }
      }
    );
  }

  autenticar_usuario() {
    console.log(this.usuario)
    this.autenticacion_service.autenticarUsuario(this.usuario).then(usuarioDevuelto => {     
      let respuesta = JSON.parse(usuarioDevuelto["data"]);
      let token = {
        'token': respuesta["token"],
        'valido': true
      }
      console.log(respuesta["token"])
      this.storage.set('token', token);
      this.autenticacion_service.setToken(respuesta["token"]);
      
      this.router.navigate(['/tabs/ver-rutas'])
    }, error => {
      let errorJSON = JSON.parse(error["error"])
      if (errorJSON['message']=="Bad credentials") {
        this.mostrarToast('Email o contraseña incorrectos.')
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
