import { Component, OnInit } from '@angular/core';
import { Horario } from '../modelos/horario';
import { RutasService } from '../servicios/rutas.service';
import { Linea } from '../modelos/linea';
import { Municipio } from '../modelos/municipio';
import { Nucleo } from '../modelos/nucleo';
import { Bloque } from '../modelos/bloque';
import { ToastController } from '@ionic/angular';
import { format, subDays } from 'date-fns'

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
  toast: any;
  modo_autobus: boolean;
  fecha_seleccionada: any;
  dia_final: string;
  lista_horarios_final: Horario[];
  adaptado_movilidad_reducida: boolean;
  lineaObtenida: Linea;
  precio_billete_sencillo: number;
  // municipioOrigen: Municipio;
  // municipioDestino: Municipio;

  constructor(private rutasService: RutasService, public toastController: ToastController) { 
    this.adaptado_movilidad_reducida = false;
  }

  ngOnInit() {
    // this.obtenerMunicipios();
    this.obtenerNucleos();
  }

  toggle_pmr_cambiado($event) {
    
    console.log(this.adaptado_movilidad_reducida)
  }

  obtenerHorarios() {
    let fecha = new Date(this.fecha_seleccionada);
    let dia_semana = format(fecha, "iiii"); 
    this.rutasService.getHorarios(this.nucleoDestino.idNucleo, this.nucleoOrigen.idNucleo).subscribe(
      (horarios)=>{
        
        console.log(horarios['horario']);
        this.horarios = horarios['horario'];
        this.horarios.forEach(horario => {
          if (horario.dias=="L-V" && (dia_semana == "Monday" || dia_semana == "Tuesday" || dia_semana == "Wednesday" || dia_semana == "Thursday" || dia_semana == "Friday")) {
            // this.obtenerInformacionLineas(parseInt(horario.idlinea), horario);
            this.obtenerDatosHorarioPorLinea(horario);
          } else if (horario.dias=="L-S" && (dia_semana == "Monday" || dia_semana == "Tuesday" || dia_semana == "Wednesday" || dia_semana == "Thursday" || dia_semana == "Friday" || dia_semana == "Saturday")) {
            // this.obtenerInformacionLineas(parseInt(horario.idlinea), horario);
            this.obtenerDatosHorarioPorLinea(horario);
          } else if (horario.dias=="Sab" && dia_semana == "Saturday") {
            // this.obtenerInformacionLineas(parseInt(horario.idlinea), horario);
            this.obtenerDatosHorarioPorLinea(horario);
          } else if (horario.dias=="Dom" && dia_semana == "Sunday") {
            this.obtenerDatosHorarioPorLinea(horario);           
            // this.obtenerInformacionLineas(parseInt(horario.idlinea), horario);
          } else if (horario.dias=="L-D" && (dia_semana == "Monday" || dia_semana == "Tuesday" || dia_semana == "Wednesday" || dia_semana == "Thursday" || dia_semana == "Friday" || dia_semana == "Saturday" || dia_semana == "Sunday")) {
            this.obtenerDatosHorarioPorLinea(horario);            
            // this.obtenerInformacionLineas(parseInt(horario.idlinea), horario);
          } else if (horario.dias=="S-D" && (dia_semana == "Saturday" || dia_semana == "Sunday")) {
            this.obtenerDatosHorarioPorLinea(horario);            
            // this.obtenerInformacionLineas(parseInt(horario.idlinea), horario);
          } else if (horario.dias=="Diar." && (dia_semana == "Monday" || dia_semana == "Tuesday" || dia_semana == "Wednesday" || dia_semana == "Thursday" || dia_semana == "Friday" || dia_semana == "Saturday" || dia_semana == "Sunday")) {
            this.obtenerDatosHorarioPorLinea(horario);            
            // this.obtenerInformacionLineas(parseInt(horario.idlinea), horario);
          } else if (horario.dias=="S-D-F" && (dia_semana == "Saturday" || dia_semana == "Sunday" || dia_semana == "Monday" || dia_semana == "Tuesday" || dia_semana == "Wednesday" || dia_semana == "Thursday" || dia_semana == "Friday")) {
            this.obtenerDatosHorarioPorLinea(horario);            
            // this.obtenerInformacionLineas(parseInt(horario.idlinea), horario);
          } else if (horario.dias=="Fest" && (dia_semana == "Monday" || dia_semana == "Tuesday" || dia_semana == "Wednesday" || dia_semana == "Thursday" || dia_semana == "Friday" || dia_semana == "Saturday" || dia_semana == "Sunday")) {
            this.obtenerDatosHorarioPorLinea(horario);            
            // this.obtenerInformacionLineas(parseInt(horario.idlinea), horario);
          } else if (horario.dias=="Esp" && (dia_semana == "Monday" || dia_semana == "Tuesday" || dia_semana == "Wednesday" || dia_semana == "Thursday" || dia_semana == "Friday" || dia_semana == "Saturday" || dia_semana == "Sunday")) {
            this.obtenerDatosHorarioPorLinea(horario);            
            // this.obtenerInformacionLineas((horario.idlinea), horario);
          } else if (horario.dias=="D y F" && (dia_semana == "Sunday" || dia_semana == "Monday" || dia_semana == "Tuesday" || dia_semana == "Wednesday" || dia_semana == "Thursday" || dia_semana == "Friday" || dia_semana == "Saturday")) {
            this.obtenerDatosHorarioPorLinea(horario);            
            // this.obtenerInformacionLineas(parseInt(horario.idlinea), horario);
          } else if (horario.dias=="L-V,E" && (dia_semana == "Monday" || dia_semana == "Tuesday" || dia_semana == "Wednesday" || dia_semana == "Thursday" || dia_semana == "Friday")) {
            this.obtenerDatosHorarioPorLinea(horario);            
            // this.obtenerInformacionLineas(parseInt(horario.idlinea), horario);
          }     
        });
      });
  }

  buscarRutas() {
    this.horarios = [];
    this.lista_horarios_final = [];
    this.nucleoOrigen = this.nucleos.find(i => i.nombre === this.origen);
    this.nucleoDestino = this.nucleos.find(i => i.nombre === this.destino);
    if (this.origen != '' && this.destino != '') {
      this.obtenerPrecioEntreOrigenYDestino(this.nucleoDestino.idNucleo, this.nucleoOrigen.idNucleo);
    } else {  
      this.mostrarToast();
    }
  }

  obtenerInformacionLineas(idlinea: number, horario: Horario) {
    
    this.rutasService.getDatosLineaPorId(idlinea).subscribe( 
      (lineaObtenida: Linea) => {
        horario.linea = lineaObtenida;
        horario.operadores = lineaObtenida.operadores;
        // if (lineaObtenida.pmr === 'Adaptada a personas con movilidad reducida') {
        //   horario.pmr = true;
        // } else {
        //   horario.pmr = false;
        // }
        // this.obtenerDatosHorarioPorLinea(horario, horario.linea);
        
        if (horario.linea.modo == 'Autobús') {
          this.modo_autobus = true;
        }
        
        // console.log(horario.operadores)
        // console.log(horario.linea.modo);
        // console.log(lineaObtenida);
        
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

  obtenerPrecioEntreOrigenYDestino(idNucleoDestino: number, idNucleoOrigen: number) {
    this.rutasService.getSaltosEntreNucleos(idNucleoDestino, idNucleoOrigen).subscribe(
      (saltos) => {
        let calculo_saltos = saltos['calculo_saltos'];
        let numero_saltos = calculo_saltos['saltos'];
        this.rutasService.getTarifas().subscribe(
          (tarifas) => {
            tarifas['tarifasInterurbanas'].forEach(tarifa => {
              if (tarifa['saltos'] == numero_saltos) {
                this.precio_billete_sencillo = tarifa['bs'];
              }
            });
          }
        );
        this.obtenerHorarios();
        console.log(calculo_saltos['saltos']);
      }
    );
  }

  obtenerDatosHorarioPorLinea(horario: Horario) {
    this.obtenerInformacionLineas(parseInt(horario.idlinea), horario);
            
    // if (linea.pmr === 'Adaptada a personas con movilidad reducida') {
    //   horario.pmr = true;
    // } else {
    //   horario.pmr = false;
    // }

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
    horario.precio_billete_sencillo = this.precio_billete_sencillo;
    // this.obtenerPrecio(this.nucleoDestino.idNucleo, this.nucleoOrigen.idNucleo, horario);
    console.log(horario)
    if (this.adaptado_movilidad_reducida == true && horario.pmr) {
      this.lista_horarios_final.push(horario);
    } else if (!this.adaptado_movilidad_reducida) {
      this.lista_horarios_final.push(horario);
    }
    console.log(this.lista_horarios_final);
    // horario.operadores = this.operadores;  
  }

  mostrarToast() {
    this.toast = this.toastController.create({
      message: 'Debes seleccionar un origen y un destino',
      duration: 2000,
      color: 'dark'
    }).then((toastData)=>{
      console.log(toastData);
      toastData.present();
    });
  }

}
