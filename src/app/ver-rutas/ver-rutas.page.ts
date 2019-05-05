import { Component, OnInit } from '@angular/core';
import { Horario } from '../modelos/horario';
import { RutasService } from '../servicios/rutas.service';
import { Linea } from '../modelos/linea';
import { Municipio } from '../modelos/municipio';
import { Nucleo } from '../modelos/nucleo';


@Component({
  selector: 'app-ver-rutas',
  templateUrl: './ver-rutas.page.html',
  styleUrls: ['./ver-rutas.page.scss'],
})
export class VerRutasPage implements OnInit {

  municipios: Municipio[];
  nucleos: Nucleo[];
  horarios: Horario[];
  origen: string = '';
  destino: string = '';
  linea: Linea;
  municipioOrigen: Municipio;

  constructor(private rutasService: RutasService) { }

  ngOnInit() {
    this.obtenerMunicipios();
  }

  obtenerHorarios() {
    
    this.rutasService.getHorarios().subscribe(
      (horarios)=>{
        console.log(horarios['horario']);
        this.horarios = horarios['horario'];
        this.horarios.forEach(horario => {
          horario.horaSalida = horario.horas[0];
          horario.horaLlegada = horario.horas[1];
          this.obtenerInformacionLineas(parseInt(horario.idlinea));
        });
      });
  }

  buscarRutas() {
    this.municipioOrigen = this.municipios.find(i => i.datos === this.origen);
    this.obtenerNucleosPorMunicipio();

    
    console.log(this.municipioOrigen);

    // this.rutasService.setOrigen(this.origen);
    // this.rutasService.setDestino(this.destino);
    // this.rutasService.construirUrl();
    this.obtenerHorarios();
  }

  obtenerInformacionLineas(idlinea: number) {
    this.rutasService.getDatosLineaPorId(idlinea).subscribe(
      (lineaObtenida) => {
        this.linea = lineaObtenida;
        console.log(this.linea);
      }
    );
  }

  obtenerMunicipios() {
    this.rutasService.getMunicipios().subscribe(
      (municipios) => {
        this.municipios = municipios['municipios'];
        // this.municipios.forEach(municipio => {
        //   municipio.idMunicipio = 
        // });
        console.log(this.municipios);
        
      }
    );
  }

  obtenerNucleosPorMunicipio() {
    console.log(this.municipioOrigen)
    this.rutasService.getNucleosporMunicipio(this.municipioOrigen.idMunicipio).subscribe(
      (nucleos) => {
        this.nucleos = nucleos;
        console.log(this.nucleos);
      }
    );
  }

}
