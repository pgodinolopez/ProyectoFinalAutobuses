import { Component, OnInit } from '@angular/core';
import { Usuario } from '../modelos/usuario';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usuario: Usuario = new Usuario('', '', '', '');;

  constructor(private autenticacion_service: AutenticacionService, private router: Router, private storage: Storage) { 
    
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
    this.autenticacion_service.autenticarUsuario(this.usuario).subscribe(usuarioDevuelto => {
      // console.log(usuarioDevuelto);
     
      let token = {
        'token': usuarioDevuelto.token,
        'valido': true
      }
      this.storage.set('token', token);
      // console.log(usuarioDevuelto.token)
      this.autenticacion_service.setToken(usuarioDevuelto.token);
      
      this.router.navigate(['/tabs/ver-rutas'])
    });
    
  }
  

}
