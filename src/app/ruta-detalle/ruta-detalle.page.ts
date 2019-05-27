import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RutasService } from '../servicios/rutas.service';
import { Horario } from '../modelos/horario';
import { GoogleMaps, GoogleMapsEvent, LatLng, GoogleMapOptions, MarkerOptions } from '@ionic-native/google-maps';
import { Linea } from '../modelos/linea';
import { Platform } from "@ionic/angular";
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
  token: string = '';

  constructor(private route: ActivatedRoute, private rutasService: RutasService, public platform: Platform, private storage: Storage) {

  }

  ngOnInit() {
    this.horario = this.rutasService.getHorarioDetalle();
    console.log(this.horario)
    console.log(this.horario.linea.polilinea);
    

    this.idlinea = this.route.snapshot.paramMap.get('idlinea');
    this.rutasService.getDatosLineaPorId(this.idlinea).subscribe(
      (lineaObtenida) => {
        this.linea = lineaObtenida;
      }
    );

    

  }

  ngOnDestroy() {
    this.map.clear();
  }
 
  ngAfterViewInit() {
    
    this.platform.ready().then( () => {
      let arrayCoordenadas = [];
      
      console.log(arrayCoordenadas)
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
      
      const posicionInicio = new LatLng(parseFloat(coordenadasIda[0].lat), parseFloat(coordinates[0].lng));
      let opcionesMarcadorInicio: MarkerOptions = { position: posicionInicio, title: 'Salida', icon: "assets/images/marker.png" };
      const marcadorInicio = map.addMarker( opcionesMarcadorInicio );

      const posicionFin = new LatLng(parseFloat(coordenadasIda[Math.round(coordenadasIda.length-1)].lat), parseFloat(coordenadasIda[Math.round(coordenadasIda.length-1)].lng));
      let opcionesMarcadorFin: MarkerOptions = { position: posicionFin, title: 'Llegada', icon: "assets/images/marker.png" };
      const marcadorFin = map.addMarker( opcionesMarcadorFin );
      
    })
  }

  addFavoritos() {
    let token = this.storage.get('token').then(
      (token) => {
        this.token = token.token;
        console.log(this.token)
        this.rutasService.postRutaFavorita(token.token, this.horario).subscribe(
          () => {
            
          }
        );
      }
    );
  }

}
