import { Component, OnInit } from '@angular/core';
import { Horario } from '../modelos/horario';
import { RutasService } from '../servicios/rutas.service';
import { Linea } from '../modelos/linea';
import { Municipio } from '../modelos/municipio';
import { Nucleo } from '../modelos/nucleo';
import { Bloque } from '../modelos/bloque';


@Component({
  selector: 'app-ver-rutas',
  templateUrl: './ver-rutas.page.html',
  styleUrls: ['./ver-rutas.page.scss'],
})
export class VerRutasPage implements OnInit {

  municipios: Municipio[];
  nucleos: Nucleo[];
  nucleoOrigen: Nucleo;
  nucleoDestino: Nucleo;
  horarios: Horario[];
  origen: string = '';
  destino: string = '';
  linea: Linea;
  bloques: Bloque[];
  orden: number;
  operadores: string;
  // municipioOrigen: Municipio;
  // municipioDestino: Municipio;

  constructor(private rutasService: RutasService) { }

  ngOnInit() {
    // this.obtenerMunicipios();
    this.obtenerNucleos();
  }

  obtenerHorarios() {
    
    this.rutasService.getHorarios(this.nucleoDestino.idNucleo, this.nucleoOrigen.idNucleo).subscribe(
      (horarios)=>{
        console.log(horarios['horario']);
        this.horarios = horarios['horario'];
        this.horarios.forEach(horario => {
          // this.obtenerBloquesLinea(parseInt(horario.idlinea));
          // this.orden = this.bloques.find(i => i.idLinea === parseInt(horario.idlinea)).orden;
          horario.horaSalida = horario.horas[0];
          if (horario.horaSalida === '--') {
            horario.horaSalida = horario.horas[1];
          }
          horario.horaLlegada = horario.horas[horario.horas.length-1];
          if (horario.horaLlegada === '--') {
            horario.horaLlegada = horario.horas[horario.horas.length-2];
          }
          this.obtenerInformacionLineas(parseInt(horario.idlinea), horario);
          this.obtenerPrecio(this.nucleoDestino.idNucleo, this.nucleoOrigen.idNucleo, horario);
          // horario.operadores = this.operadores;
        });
      });
  }

  buscarRutas() {
    this.nucleoOrigen = this.nucleos.find(i => i.nombre === this.origen);
    this.nucleoDestino = this.nucleos.find(i => i.nombre === this.destino);
    this.obtenerHorarios();
    
  }

  obtenerInformacionLineas(idlinea: number, horario: Horario) {
    this.rutasService.getDatosLineaPorId(idlinea).subscribe( 
      (lineaObtenida) => {
        horario.operadores = lineaObtenida.operadores;
        console.log(horario.operadores)
        console.log(lineaObtenida);
      }
    );
  }

  // obtenerMunicipios() {
  //   this.rutasService.getMunicipios().subscribe(
  //     (municipios) => {
  //       this.municipios = municipios['municipios'];
  //       // this.municipios.forEach(municipio => {
  //       //   municipio.idMunicipio = 
  //       // });
  //       console.log(this.municipios);
        
  //     }
  //   );
  // }

  obtenerNucleos() {
    this.rutasService.getNucleos().subscribe(
      (nucleos) => {
        this.nucleos = nucleos['nucleos'];
        console.log(this.nucleos);
      }
    );
  }

  obtenerBloquesLinea(idlinea: number) {
    this.rutasService.obtenerBloquesDePasoPorIdLinea(idlinea).subscribe(
      (bloques) => {
        this.bloques = bloques['bloques'];
        console.log(this.bloques);
      }
    );
  }

  obtenerPrecio(idNucleoDestino: number, idNucleoOrigen: number, horario: Horario) {
    this.rutasService.getSaltosEntreNucleos(idNucleoDestino, idNucleoOrigen).subscribe(
      (saltos) => {
        let calculo_saltos = saltos['calculo_saltos'];
        let numero_saltos = calculo_saltos['saltos'];
        this.rutasService.getTarifas().subscribe(
          (tarifas) => {
            tarifas['tarifasInterurbanas'].forEach(tarifa => {
              if (tarifa['saltos'] == numero_saltos) {
                horario.precio_billete_sencillo = tarifa['bs'];
              }
            });
          }
        );
        console.log(calculo_saltos['saltos']);
      }
    );
  }
 
}
