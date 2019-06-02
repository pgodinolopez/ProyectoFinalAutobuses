import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  MarkerOptions,
  Marker,
  MarkerCluster
} from "@ionic-native/google-maps";
import { Geolocation } from '@ionic-native/geolocation/ngx';


import { Platform, NavController, LoadingController, ActionSheetController } from "@ionic/angular";
import { ParadasService } from '../servicios/paradas.service';
import { Parada } from '../modelos/parada';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
// import { MapsProvider } from './../../providers/maps/maps';

declare var google: any;
@Component({
  selector: 'app-paradas-cercanas',
  templateUrl: './paradas-cercanas.page.html',
  styleUrls: ['./paradas-cercanas.page.scss'],
})
export class ParadasCercanasPage {
  
  listaParadas: Parada[]; 
  localizacion = {latitud: null, longitud: null};
  contador:number = 0;
  token: any = {
    'token': '',
    'valido': false,
  };

  constructor(public platform: Platform, public nav: NavController, private paradasService: ParadasService,
     public geolocation: Geolocation, private androidPermissions: AndroidPermissions,
     private loadingController: LoadingController, private actionSheetController: ActionSheetController,
     private router: Router, private storage: Storage) {
    this.listaParadas = [];
  }

  async obtenerParadas() {

    await this.paradasService.getParadas().then(
      (paradas:Parada[]) => {
        let paradasObtenidas = paradas['paradas'];
        this.obtenerDatosParada(paradasObtenidas).then(()=>{
          this.obtenerPosicionActual(this.listaParadas);        
          console.log(this.listaParadas);
        })
      }
    );
  }
  
  async obtenerDatosParada(paradasObtenidas) {
    await paradasObtenidas.forEach(parada => {
      this.paradasService.getDatosParada(parada['idParada']).then(
        (datosParada:Parada) => {
          if (datosParada.descripcion==='Autobús') {
            this.listaParadas.push(datosParada);
            
          }
        }
      );
    });
  }

  ionViewDidEnter() {
    let token = this.storage.get('token').then(
      (token) => {
        if(token!=null) {
          this.token = token;
      }
    });

    this.platform.ready().then( () => {
      this.obtenerParadas().then(
        ()=>{
          // this.obtenerPosicionActual();
        }
      );
			
		});
		
	}

  obtenerPosicionActual(listaParadas) {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {
          this.geolocation.getCurrentPosition().then((position) =>  {
            this.localizacion.latitud = position.coords.latitude;
            this.localizacion.longitud = position.coords.longitude;
            console.log(this.localizacion.latitud)
            console.log(this.localizacion.longitud)
            let coordinates: LatLng = new LatLng( this.localizacion.latitud, this.localizacion.longitud );
            console.log(coordinates)
            this.loadMap(coordinates, listaParadas);
          });
          
          
          
        } else {
          //If having permission show 'Turn On GPS' dialogue
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
           () => {
            this.geolocation.getCurrentPosition().then((position) =>  {
              this.localizacion.latitud = position.coords.latitude;
              this.localizacion.longitud = position.coords.longitude;
              console.log(this.localizacion.latitud)
              console.log(this.localizacion.longitud)
              let coordinates: LatLng = new LatLng( this.localizacion.latitud, this.localizacion.longitud );
              console.log(coordinates)
              this.loadMap(coordinates, listaParadas);
            });


           }
          )
          //If not having permission ask for permission
          // this.requestGPSPermission();
        }
      },
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
    )
  }

  loadMap(coordinates: any, listaParadas) {
    
    let position = {
      target: coordinates,
      zoom: 14,
      tilt: 30
    };

    let map = GoogleMaps.create( 'map');

    map.one( GoogleMapsEvent.MAP_READY ).then( ( data: any ) => {
  
      map.animateCamera( position );
      
      this.obtenerMarcadores(map, listaParadas);
    })
  }

  obtenerMarcadores(mapa, listaParadas) {
    for (let i = 0; i < listaParadas.length; i++) {
      this.addMarcadores(listaParadas[i], mapa);
      console.log(listaParadas.length)
    }
  }

  addMarcadores(parada, mapa) {
    const posicion = new LatLng(parada.latitud, parada.longitud);
    let opcionesMarcador: MarkerOptions = { position: posicion, title: parada.nombre, icon: "assets/images/marker.png" };
    const marcador = mapa.addMarker( opcionesMarcador );
    
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

}

