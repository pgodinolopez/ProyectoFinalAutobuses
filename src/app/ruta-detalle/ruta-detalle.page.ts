import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RutasService } from '../servicios/rutas.service';
import { Horario } from '../modelos/horario';
import { GoogleMaps, GoogleMapsEvent, LatLng, GoogleMapOptions, MarkerOptions } from '@ionic-native/google-maps';
import { Linea } from '../modelos/linea';
import { Platform, ActionSheetController, ToastController } from "@ionic/angular";
import { Storage } from '@ionic/storage';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Nucleo } from '../modelos/nucleo';
import { ParadasService } from '../servicios/paradas.service';
import { Parada } from '../modelos/parada';

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
  nucleos: Nucleo[];
  nucleoOrigen: Nucleo;
  nucleoDestino: Nucleo;
  toast: any;
  listaHorarios: Horario[];
  rutaFavorita: boolean = false;
  coordenadasOrigen: any;

  constructor(private route: ActivatedRoute, private rutasService: RutasService, public platform: Platform, private storage: Storage,
    private actionSheetController: ActionSheetController, private router: Router, public toastController: ToastController,
    private nativeGeocoder: NativeGeocoder, private paradasService: ParadasService) {

  }

  ngOnInit() {
    
    // this.obtenerNucleos();
  }

  ionViewDidEnter() {
    this.horario = this.rutasService.getHorarioDetalle();

    let token = this.storage.get('token').then(
      (token) => {
        this.token = token;
      }
    );
    
  }

  obtenerRutasFavoritas(token: any) {
    this.rutasService.getRutasFavoritas(token.token).then(
      (respuesta)=>{
        // let respuestaJSON = JSON.parse(respuesta["data"]);
        let respuestaJSON = JSON.parse(respuesta["data"]);        
        this.listaHorarios = respuestaJSON["data"]; 
        if (this.listaHorarios.length==0) {
          this.rutasService.postRutaFavorita(token.token, this.horario).then(
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
                this.rutasService.postRutaFavorita(token.token, this.horario).then(
                  () => {
                    
                  }
                );
                this.mostrarToast('Ruta añadida a favoritos')
                break;
              }
          };
        }
      }, error => {
        let errorJSON = JSON.parse(error["error"])        
        if (errorJSON['message']=="Expired JWT Token") {
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


    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    let posicionOrigen;
    let posicionDestino;

    this.rutasService.getGeoCodefromGoogleAPI(this.horario.origen).subscribe(addressData => {

      let latitud: string = addressData.results[0].geometry.location.lat;
      let longitud: string = addressData.results[0].geometry.location.lng;
      posicionOrigen = new LatLng(parseFloat(latitud), parseFloat(longitud));
    });

    this.rutasService.getGeoCodefromGoogleAPI(this.horario.destino).subscribe(addressData => {

      let latitud: string = addressData.results[0].geometry.location.lat;
      let longitud: string = addressData.results[0].geometry.location.lng;
      posicionDestino = new LatLng(parseFloat(latitud), parseFloat(longitud));
    });

    // this.nativeGeocoder.forwardGeocode(this.horario.origen, options)
    //   .then((result: NativeGeocoderResult[]) => posicionOrigen = new LatLng(parseFloat(result[0].latitude), parseFloat(result[0].longitude)))
    //   .catch((error: any) => console.log(error));

    // this.nativeGeocoder.forwardGeocode(this.horario.destino, options)
    //   .then((result: NativeGeocoderResult[]) => posicionDestino = new LatLng(parseFloat(result[0].latitude), parseFloat(result[0].longitude)))
    //   .catch((error: any) => console.log(error));

    let mapOptions: GoogleMapOptions = {
      camera: {
          target: {
            lat: parseFloat(coordenadasIda[Math.round(coordenadasIda.length/2)].lat),
            lng: parseFloat(coordenadasIda[Math.round(coordenadasIda.length/2)].lng)
            // lat: posicionOrigen.lat,
            // lng: posicionOrigen.lng
          },
          zoom: 9
      }
    }

    let map = GoogleMaps.create( 'map', mapOptions);
    this.map = map;
    // let map = GoogleMaps.create( 'map', position );
    

    map.one( GoogleMapsEvent.MAP_READY ).then( ( data: any ) => {
       this.rutasService.getPolylineDirectionsApi(posicionOrigen.lat, posicionOrigen.lng, posicionDestino.lat, posicionDestino.lng).then(
        (response) => {
          let response_data = JSON.parse(response.data);

          let decodedPoints = GoogleMaps.getPlugin().geometry.encoding.decodePath(response_data["routes"][0].overview_polyline.points);
          map.addPolyline({
            points : decodedPoints,
            color : '#AA00FF',
            width: 10,
            geodesic : true
            })
            const posicionFin = posicionDestino;
            let opcionesMarcadorInicio: MarkerOptions = { position: posicionFin, title: 'Llegada', icon: "assets/images/marker.png" };
            const marcadorFin = map.addMarker( opcionesMarcadorInicio );

            const posicionInicio = posicionOrigen;
            let opcionesMarcadorFin: MarkerOptions = { position: posicionInicio, title: 'Salida', icon: "assets/images/marker.png" };
            const marcadorInicio = map.addMarker( opcionesMarcadorFin );
        }
      );
      
      // map.addPolyline({
      //   points: coordenadasIda,
      //   'color' : '#AA00FF',
      //   'width': 10,
      //   'geodesic': true
      // });
      
      // const posicionFin = new LatLng(parseFloat(coordenadasIda[0].lat), parseFloat(coordinates[0].lng));
      // let opcionesMarcadorInicio: MarkerOptions = { position: posicionFin, title: 'Llegada', icon: "assets/images/marker.png" };
      // const marcadorFin = map.addMarker( opcionesMarcadorInicio );

      // const posicionInicio = new LatLng(parseFloat(coordenadasIda[Math.round(coordenadasIda.length-1)].lat), parseFloat(coordenadasIda[Math.round(coordenadasIda.length-1)].lng));
      // let opcionesMarcadorFin: MarkerOptions = { position: posicionInicio, title: 'Salida', icon: "assets/images/marker.png" };
      // const marcadorInicio = map.addMarker( opcionesMarcadorFin );

      
      
    })
  }

  addFavoritos() {
    this.obtenerRutasFavoritas(this.token);    
  }

  borrarHorarioFavorito(token: string, id: number) {
    this.rutasService.deleteRutaFavorita(token, id).then(
      () => {

      }, error => {
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

  // obtenerNucleos() {
  //   this.rutasService.getNucleos().subscribe(
  //     (nucleos) => {
  //       this.nucleos = nucleos['nucleos'];
  //     }
  //   );
  //   this.nucleoOrigen = this.nucleos.find(i => i.nombre === this.horario.origen);
  //   this.nucleoDestino = this.nucleos.find(i => i.nombre === this.horario.destino);
  //   this.paradasService.getDatosParada(this.nucleoOrigen.idNucleo).then(
  //     (datosParada: Parada)=>{
  //       this.coordenadasOrigen = new LatLng(datosParada.latitud, datosParada.longitud);
        
  //     }
  //   )

  // }
}
