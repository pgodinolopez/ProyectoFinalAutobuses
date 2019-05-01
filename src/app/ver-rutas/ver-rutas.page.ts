import { Component, OnInit } from '@angular/core';
import { Horario } from '../modelos/horario';
import { RutasService } from '../servicios/rutas.service';

@Component({
  selector: 'app-ver-rutas',
  templateUrl: './ver-rutas.page.html',
  styleUrls: ['./ver-rutas.page.scss'],
})
export class VerRutasPage implements OnInit {

  horarios: Horario[];
  horaSalida: string;
  horaLlegada: string;
  origen: string = '';
  destino: string = '';

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
        });
      });
  }

  buscarRutas() {
    this.rutasService.setOrigen(this.origen);
    this.rutasService.setDestino(this.destino);
    this.rutasService.construirUrl();
    this.obtenerHorarios();
  }

}
