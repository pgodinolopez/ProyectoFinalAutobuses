import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  MarkerOptions,
  Marker
} from "@ionic-native/google-maps";
import { Geolocation } from '@ionic-native/geolocation/ngx';


import { Platform, NavController } from "@ionic/angular";
import { ParadasService } from '../servicios/paradas.service';
import { Parada } from '../modelos/parada';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
// import { MapsProvider } from './../../providers/maps/maps';

declare var google: any;
@Component({
  selector: 'app-paradas-cercanas',
  templateUrl: './paradas-cercanas.page.html',
  styleUrls: ['./paradas-cercanas.page.scss'],
})
export class ParadasCercanasPage implements OnInit {
  
  listaParadas: Parada[]; 
  localizacion = {latitud: null, longitud: null};

  constructor(public platform: Platform, public nav: NavController, private paradasService: ParadasService, public geolocation: Geolocation, private androidPermissions: AndroidPermissions) {
    this.listaParadas = [];
  }

  async obtenerParadas() {
    await this.paradasService.getParadas().subscribe(
      (paradas) => {
        let paradasObtenidas = paradas['paradas'];
        // this.listaParadas = paradas['paradas'];
        paradasObtenidas.forEach(parada => {
          this.paradasService.getDatosParada(parada['idParada']).subscribe(
            (datosParada) => {
              if (datosParada.descripcion==='Autobús') {
                this.listaParadas.push(datosParada);
                
              }
            }
          );
        });
        console.log(this.listaParadas);
      }
    );
  }
 
  ngOnInit() {
    
    
    
    // this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);

    
    // let options = {
    //   enableHighAccuracy: true,
    //   timeout: 25000
    // };
    

    

      
  }

  ngAfterViewInit() {
    
		this.platform.ready().then( () => {
      this.obtenerParadas();
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
              this.loadMap(coordinates);
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
                this.loadMap(coordinates);
              });
  
  
             }
            )
            //If not having permission ask for permission
            // this.requestGPSPermission();
          }
        },
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
      )
		});
	}

  loadMap(coordinates: any) {
    
    let position = {
      target: coordinates,
      zoom: 14,
      tilt: 30
    };

    let map = GoogleMaps.create( 'map');
    // let map = GoogleMaps.create( 'map', position );
  

    map.one( GoogleMapsEvent.MAP_READY ).then( ( data: any ) => {
  
      
      
      
  
      map.animateCamera( position );
  
      this.listaParadas.forEach(parada => {
        
        let coordenadasParada: LatLng = new LatLng(parada.latitud, parada.longitud);

        let markerOptions: MarkerOptions = {
          position: coordenadasParada,
          icon: "assets/images/marker.png",
          title: parada.nombre
        };
    
        const marker = map.addMarker( markerOptions )
        
      });
    })
  }

}
