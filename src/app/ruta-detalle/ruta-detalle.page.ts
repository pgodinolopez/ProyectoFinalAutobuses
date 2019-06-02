import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RutasService } from '../servicios/rutas.service';
import { Horario } from '../modelos/horario';
import { GoogleMaps, GoogleMapsEvent, LatLng, GoogleMapOptions, MarkerOptions } from '@ionic-native/google-maps';
import { Linea } from '../modelos/linea';
import { Platform, ActionSheetController, ToastController } from "@ionic/angular";
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-ruta-detalle',
  templateUrl: './ruta-detalle.page.html',
  styleUrls: ['./ruta-detalle.page.scss'],
})
export class RutaDetallePage implements OnInit {

  idlinea: any; 
  horario: Horario;
  linea: Linea;
  map: any;
  token: any = {
    'token': '',
    'valido': false,
  };
  toast: any;
  listaHorarios: Horario[];
  rutaFavorita: boolean = false;

  constructor(private route: ActivatedRoute, private rutasService: RutasService, public platform: Platform, private storage: Storage,
    private actionSheetController: ActionSheetController, private router: Router, public toastController: ToastController) {

  }

  ngOnInit() {
    this.horario = this.rutasService.getHorarioDetalle();
  }

  ionViewDidEnter() {
    let token = this.storage.get('token').then(
      (token) => {
        this.token = token;
      }
    );
  }

  obtenerRutasFavoritas(token: any) {
    this.rutasService.getRutasFavoritas(token.token).subscribe(
      (respuesta)=>{
        console.log(respuesta)
        this.listaHorarios = respuesta['data']; 
        if (this.listaHorarios.length==0) {
          this.rutasService.postRutaFavorita(token.token, this.horario).subscribe(
            () => {
              
            }
          );
          this.mostrarToast('Ruta añadida a favoritos')

        } else {
          let horarioPulsado = this.rutasService.getHorarioDetalle();
          for (let i = 0; i < this.listaHorarios.length; i++) {
            if (horarioPulsado.idlinea == this.listaHorarios[i].idlinea && horarioPulsado.codigo == this.listaHorarios[i].codigo && 
              horarioPulsado.origen == this.listaHorarios[i].origen && horarioPulsado.destino == this.listaHorarios[i].destino && horarioPulsado.operadores == this.listaHorarios[i].operadores && 
              horarioPulsado.hora_salida == this.listaHorarios[i].hora_salida && horarioPulsado.hora_llegada == this.listaHorarios[i].hora_llegada
              ) {
                // La ruta es favorita
                this.borrarHorarioFavorito(token.token, this.listaHorarios[i]["id"]);
                this.mostrarToast('Ruta borrada de favoritos')
                break;
              } else {
                // La ruta no es favorita
                this.rutasService.postRutaFavorita(token.token, this.horario).subscribe(
                  () => {
                    
                  }
                );
                this.mostrarToast('Ruta añadida a favoritos')
                break;
              }
          };
        }
      }, error => {
      console.log('error', error['error']);
      if (error['error']['message']=="Expired JWT Token") {
        let token = {
          'token': this.token.token,
          'valido': false
        }
        this.storage.set('token', token);
      } 
    });
  }

  ngOnDestroy() {
    this.map.clear();
  }
 
  ngAfterViewInit() {
    
    this.platform.ready().then( () => {
      let arrayCoordenadas = [];
      this.loadMap(this.horario.linea);
    });
		
	}

  loadMap(linea: Linea) {
    
    let coordinates = this.horario.linea.polilinea.map(function(point) {
      let stringPoint = point+'';
      let splitStringPoint = stringPoint.split(',')
      return {lat: splitStringPoint[0], lng: splitStringPoint[1]};
    });

    let coordenadasIda = [];

    for (let i = 0; i < coordinates.length/2; i++) {
      coordenadasIda.push(coordinates[i]);
    }

    console.log(coordenadasIda)

    let mapOptions: GoogleMapOptions = {
      camera: {
          target: {
            lat: parseFloat(coordenadasIda[Math.round(coordenadasIda.length/2)].lat),
            lng: parseFloat(coordenadasIda[Math.round(coordenadasIda.length/2)].lng)
          },
          zoom: 9
      }
    }

    let map = GoogleMaps.create( 'map', mapOptions);
    this.map = map;
    // let map = GoogleMaps.create( 'map', position );
    

    map.one( GoogleMapsEvent.MAP_READY ).then( ( data: any ) => {
      
      
      map.addPolyline({
        points: coordenadasIda,
        'color' : '#AA00FF',
        'width': 10,
        'geodesic': true
      });
      
      const posicionFin = new LatLng(parseFloat(coordenadasIda[0].lat), parseFloat(coordinates[0].lng));
      let opcionesMarcadorInicio: MarkerOptions = { position: posicionFin, title: 'Llegada', icon: "assets/images/marker.png" };
      const marcadorFin = map.addMarker( opcionesMarcadorInicio );

      const posicionInicio = new LatLng(parseFloat(coordenadasIda[Math.round(coordenadasIda.length-1)].lat), parseFloat(coordenadasIda[Math.round(coordenadasIda.length-1)].lng));
      let opcionesMarcadorFin: MarkerOptions = { position: posicionInicio, title: 'Salida', icon: "assets/images/marker.png" };
      const marcadorInicio = map.addMarker( opcionesMarcadorFin );
      
    })
  }

  addFavoritos() {
    this.obtenerRutasFavoritas(this.token);    
  }

  borrarHorarioFavorito(token: string, id: number) {
    this.rutasService.deleteRutaFavorita(token, id).subscribe(
      () => {

      }
    );
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

  irAPaginaLogin() {
    this.router.navigate(['/tabs/login']);
  }
  
  mostrarToast(mensaje: string) {
    this.toast = this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: 'dark'
    }).then((toastData)=>{
      toastData.present();
    });
  }
}
