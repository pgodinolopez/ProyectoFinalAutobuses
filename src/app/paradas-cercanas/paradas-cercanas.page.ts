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


import { Platform, NavController, LoadingController } from "@ionic/angular";
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
  contador:number = 0;

  constructor(public platform: Platform, public nav: NavController, private paradasService: ParadasService, public geolocation: Geolocation, private androidPermissions: AndroidPermissions, private loadingController: LoadingController) {
    this.listaParadas = [];
  }

  async obtenerParadas() {
    
    // const loading = await this.loadingController.create({});
   
    // loading.present().then(() => {
    //    // do your stuffs backend call etc here
    //    this.yourStuffs().then(() => {
    //         // Whatever you have still things to do you could do here
    //         // finally close loading 
    //         loading.dismiss();
    //    });
    // });

    await this.paradasService.getParadas().then(
      (paradas:Parada[]) => {
        let paradasObtenidas = paradas['paradas'];
        // this.listaParadas = paradas['paradas'];
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

  ngOnInit() {
    
    this.platform.ready().then( () => {
      this.obtenerParadas().then(
        ()=>{
          // this.obtenerPosicionActual();
        }
      );
			
		});
    
    // this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);

    
    // let options = {
    //   enableHighAccuracy: true,
    //   timeout: 25000
    // };
    

    

      
  }

  ngAfterViewInit() {
    
		
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
    // let map = GoogleMaps.create( 'map', position );
    

    map.one( GoogleMapsEvent.MAP_READY ).then( ( data: any ) => {
  
      
      
      
  
      map.animateCamera( position );
      
      

      // this.listaParadas.forEach(parada => {
      //   this.contador++;  
      //   let coordenadasParada: LatLng = new LatLng(parada.latitud, parada.longitud);

      //   let markerOptions: MarkerOptions = {
      //     position: coordenadasParada,
      //     icon: "assets/images/marker.png",
      //     title: parada.nombre
      //   };
    
      //   const marker = map.addMarker( markerOptions );
      //   console.log(this.contador);
      //   console.log(this.listaParadas.length);
        
      // });
      this.obtenerMarcadores(map, listaParadas);
    })
  }

  obtenerMarcadores(mapa, listaParadas) {
    // tslint:disable-next-line:variable-name
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

}

