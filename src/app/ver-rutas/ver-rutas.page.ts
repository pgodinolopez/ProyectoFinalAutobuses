import { Component, OnInit } from '@angular/core';
import { Horario } from '../modelos/horario';
import { RutasService } from '../servicios/rutas.service';
import { Linea } from '../modelos/linea';
import { homedir } from 'os';

@Component({
  selector: 'app-ver-rutas',
  templateUrl: './ver-rutas.page.html',
  styleUrls: ['./ver-rutas.page.scss'],
})
export class VerRutasPage implements OnInit {

  horarios: Horario[];
  origen: string = '';
  destino: string = '';
  linea: Linea;

  constructor(private rutasService: RutasService) { }

  ngOnInit() {
  
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
    this.rutasService.setOrigen(this.origen);
    this.rutasService.setDestino(this.destino);
    this.rutasService.construirUrl();
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

}
