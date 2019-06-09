import { Component, OnInit } from '@angular/core';
import { Horario } from '../modelos/horario';
import { RutasService } from '../servicios/rutas.service';
import { Linea } from '../modelos/linea';
import { Municipio } from '../modelos/municipio';
import { Nucleo } from '../modelos/nucleo';
import { Bloque } from '../modelos/bloque';
import { ToastController, ActionSheetController } from '@ionic/angular';
import { format, subDays, parse, parseISO, toDate } from 'date-fns'
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-ver-rutas',
  templateUrl: './ver-rutas.page.html',
  styleUrls: ['./ver-rutas.page.scss'],
})
export class VerRutasPage implements OnInit {

  token: any = {
    'token': '',
    'valido': false,
  };
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
  precio_tarjeta: number;
  hora_filtro: any;
  
  filtrosExpandidos: boolean = false;

  constructor(private rutasService: RutasService, public toastController: ToastController, private router: Router, private storage: Storage, private actionSheetController: ActionSheetController) { 
    this.adaptado_movilidad_reducida = false;
  }

  ngOnInit() {
    // this.obtenerMunicipios();
    this.obtenerNucleos();
    
  }

  ionViewDidEnter() {
    let token = this.storage.get('token').then(
      (token) => {
        if(token!=null) {
          this.token = token;
      }
    });
  }

  toggle_pmr_cambiado($event) {
    
  }

  obtenerHorarios() {
    let fecha = new Date(this.fecha_seleccionada);
    let dia_semana = format(fecha, "iiii"); 
    this.rutasService.getHorarios(this.nucleoDestino.idNucleo, this.nucleoOrigen.idNucleo).subscribe(
      (horarios)=>{
        
        this.horarios = horarios['horario'];
        this.horarios.forEach(horario => {
          if (horario.dias=="L-V" && (dia_semana == "Monday" || dia_semana == "Tuesday" || dia_semana == "Wednesday" || dia_semana == "Thursday" || dia_semana == "Friday")) {
            this.obtenerInformacionLineas(parseInt(horario.idlinea), horario);
          } else if (horario.dias=="L-S" && (dia_semana == "Monday" || dia_semana == "Tuesday" || dia_semana == "Wednesday" || dia_semana == "Thursday" || dia_semana == "Friday" || dia_semana == "Saturday")) {
            this.obtenerInformacionLineas(parseInt(horario.idlinea), horario);
          } else if (horario.dias=="Sab" && dia_semana == "Saturday") {
            this.obtenerInformacionLineas(parseInt(horario.idlinea), horario);
          } else if (horario.dias=="Dom" && dia_semana == "Sunday") {
            this.obtenerInformacionLineas(parseInt(horario.idlinea), horario);
          } else if (horario.dias=="L-D" && (dia_semana == "Monday" || dia_semana == "Tuesday" || dia_semana == "Wednesday" || dia_semana == "Thursday" || dia_semana == "Friday" || dia_semana == "Saturday" || dia_semana == "Sunday")) {
            this.obtenerInformacionLineas(parseInt(horario.idlinea), horario);
          } else if (horario.dias=="S-D" && (dia_semana == "Saturday" || dia_semana == "Sunday")) {
            this.obtenerInformacionLineas(parseInt(horario.idlinea), horario);
          } else if (horario.dias=="Diar." && (dia_semana == "Monday" || dia_semana == "Tuesday" || dia_semana == "Wednesday" || dia_semana == "Thursday" || dia_semana == "Friday" || dia_semana == "Saturday" || dia_semana == "Sunday")) {
            this.obtenerInformacionLineas(parseInt(horario.idlinea), horario);
          } else if (horario.dias=="S-D-F" && (dia_semana == "Saturday" || dia_semana == "Sunday" || dia_semana == "Monday" || dia_semana == "Tuesday" || dia_semana == "Wednesday" || dia_semana == "Thursday" || dia_semana == "Friday")) {
            this.obtenerInformacionLineas(parseInt(horario.idlinea), horario);
          } else if (horario.dias=="Fest" && (dia_semana == "Monday" || dia_semana == "Tuesday" || dia_semana == "Wednesday" || dia_semana == "Thursday" || dia_semana == "Friday" || dia_semana == "Saturday" || dia_semana == "Sunday")) {
            this.obtenerInformacionLineas(parseInt(horario.idlinea), horario);
          } else if (horario.dias=="Esp" && (dia_semana == "Monday" || dia_semana == "Tuesday" || dia_semana == "Wednesday" || dia_semana == "Thursday" || dia_semana == "Friday" || dia_semana == "Saturday" || dia_semana == "Sunday")) {
            this.obtenerInformacionLineas(parseInt(horario.idlinea), horario);
          } else if (horario.dias=="D y F" && (dia_semana == "Sunday" || dia_semana == "Monday" || dia_semana == "Tuesday" || dia_semana == "Wednesday" || dia_semana == "Thursday" || dia_semana == "Friday" || dia_semana == "Saturday")) {
            this.obtenerInformacionLineas(parseInt(horario.idlinea), horario);
          } else if (horario.dias=="L-V,E" && (dia_semana == "Monday" || dia_semana == "Tuesday" || dia_semana == "Wednesday" || dia_semana == "Thursday" || dia_semana == "Friday")) {
            this.obtenerInformacionLineas(parseInt(horario.idlinea), horario);
          }     
        });
      }, error => {
        if (error['error']['error']=="No se encuentran los datos") {
          this.mostrarToast('No se han encontrado resultados.')
        } 
      });
      
  }

  buscarRutas() {
    this.horarios = [];
    this.lista_horarios_final = [];
    this.nucleoOrigen = this.nucleos.find(i => i.nombre === this.origen);
    this.nucleoDestino = this.nucleos.find(i => i.nombre === this.destino);
    if (this.origen != '' && this.destino != '' && this.fecha_seleccionada != undefined) {
      this.obtenerPrecioEntreOrigenYDestino(this.nucleoDestino.idNucleo, this.nucleoOrigen.idNucleo);
    } else {  
      this.mostrarToast('Debes seleccionar un origen, un destino y una fecha');
    }
    
  }

  obtenerInformacionLineas(idlinea: number, horario: Horario) {
    
    this.rutasService.getDatosLineaPorId(idlinea).subscribe( 
      (lineaObtenida: Linea) => {
        horario.linea = lineaObtenida;
        horario.operadores = lineaObtenida.operadores;
        if (lineaObtenida.pmr === 'Adaptada a personas con movilidad reducida') {
          horario.pmr = true;
        } else {
          horario.pmr = false;
        }
        this.obtenerDatosHorarioPorLinea(horario, horario.linea);
        
        if (horario.linea.modo == 'Autobús') {
          this.modo_autobus = true;
        }       
      }
      
    );
    
  }

  obtenerNucleos() {
    this.rutasService.getNucleos().subscribe(
      (nucleos) => {
        this.nucleos = nucleos['nucleos'];
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
                this.precio_tarjeta = tarifa['tarjeta'];
              }
            });
          }
        );
        this.obtenerHorarios();
      }
    );
  }

  obtenerDatosHorarioPorLinea(horario: Horario, linea: Linea) {
    // this.obtenerInformacionLineas(parseInt(horario.idlinea), horario);



    if (linea.pmr === 'Adaptada a personas con movilidad reducida') {
      horario.pmr = true;
    } else {
      horario.pmr = false;
    }

    // this.obtenerBloquesLinea(parseInt(horario.idlinea));
    // this.orden = this.bloques.find(i => i.idLinea === parseInt(horario.idlinea)).orden;
    
    horario.hora_salida = horario.horas[0];
    if (horario.hora_salida === '--') {
      horario.hora_salida = horario.horas[1];
    }
    
    horario.hora_llegada = horario.horas[horario.horas.length-1];
    if (horario.hora_llegada === '--') {
      horario.hora_llegada = horario.horas[horario.horas.length-2];
    }

    let horaComienzo = new Date("Mon Jan 01 2007 " + horario.hora_salida + ':00 GMT+0530').getTime();
    let horaFin = new Date("Mon Jan 01 2007 " + horario.hora_llegada + ':00 GMT+0530').getTime();
    let diferenciaMs = horaFin - horaComienzo; 
    let diferenciaMinutos = diferenciaMs / 60 / 1000; 
    let diferenciaHoras = diferenciaMs / 3600 / 1000; 
    
    let tiempoEstimadoObj = {};
    tiempoEstimadoObj["horas"] = Math.floor(diferenciaHoras);
    tiempoEstimadoObj["minutos"] = diferenciaMinutos - 60 * tiempoEstimadoObj["horas"];
    let stringTiempoEstimado = tiempoEstimadoObj["horas"] + ' h ' + tiempoEstimadoObj["minutos"] + ' min';
    horario.tiempo_estimado = stringTiempoEstimado;
    horario.origen = this.origen;
    horario.destino = this.destino;
    
    if (this.hora_filtro != undefined) {
      let hora = new Date(this.hora_filtro);
      let horaAFiltrar = format(hora, "H");
      let minutosAFiltrar = format(hora, "m");
      let horaYMinutosAFiltrar = horaAFiltrar + '.' + minutosAFiltrar;
      let horaSalidaYMinutos = horario.hora_salida.replace(':', '.');
      
      if (parseFloat(horaSalidaYMinutos) >= parseFloat(horaYMinutosAFiltrar)) {
      
      horario.precio_billete_sencillo = this.precio_billete_sencillo;
      horario.precio_tarjeta = this.precio_tarjeta;
      // this.obtenerPrecio(this.nucleoDestino.idNucleo, this.nucleoOrigen.idNucleo, horario);
      if (this.adaptado_movilidad_reducida == true && horario.pmr) {
        this.lista_horarios_final.push(horario);
      } else if (!this.adaptado_movilidad_reducida) {
        this.lista_horarios_final.push(horario);
      }    

      this.lista_horarios_final.sort((a, b)=>{
        let horaSalidaYMinutosA = a.hora_salida.replace(':', '.');
        let horaSalidaYMinutosB = b.hora_salida.replace(':', '.');
        let horaLlegadaYMinutosA = a.hora_salida.replace(':', '.');
        let horaLlegadaYMinutosB = b.hora_salida.replace(':', '.');
        if(parseFloat(horaSalidaYMinutosA)>parseFloat(horaSalidaYMinutosB)) {
          return 1;
        }
        if(parseFloat(horaSalidaYMinutosA)<parseFloat(horaSalidaYMinutosB)) {
          return -1;
        }
        // Si salen a la misma hora comparamos por hora de llegada
        if(parseFloat(horaSalidaYMinutosA)==parseFloat(horaSalidaYMinutosB)) {
          if(parseFloat(horaLlegadaYMinutosA)>parseFloat(horaLlegadaYMinutosB)) {
            return 1;
          }
          if(parseFloat(horaLlegadaYMinutosA)<parseFloat(horaLlegadaYMinutosB)) {
            return -1;
          }
        }
        return 0;
        });
     
      }

      

    } else {

      horario.precio_billete_sencillo = this.precio_billete_sencillo;
      horario.precio_tarjeta = this.precio_tarjeta;
      // this.obtenerPrecio(this.nucleoDestino.idNucleo, this.nucleoOrigen.idNucleo, horario);
      if (this.adaptado_movilidad_reducida == true && horario.pmr) {
        this.lista_horarios_final.push(horario);
      } else if (!this.adaptado_movilidad_reducida) {
        this.lista_horarios_final.push(horario);
      }    

      this.lista_horarios_final.sort((a, b)=>{
        let horaSalidaYMinutosA = a.hora_salida.replace(':', '.');
        let horaSalidaYMinutosB = b.hora_salida.replace(':', '.');
        let horaLlegadaYMinutosA = a.hora_salida.replace(':', '.');
        let horaLlegadaYMinutosB = b.hora_salida.replace(':', '.');
        if(parseFloat(horaSalidaYMinutosA)>parseFloat(horaSalidaYMinutosB)) {
          return 1;
        }
        if(parseFloat(horaSalidaYMinutosA)<parseFloat(horaSalidaYMinutosB)) {
          return -1;
        }
        // Si salen a la misma hora comparamos por hora de llegada
        if(parseFloat(horaSalidaYMinutosA)==parseFloat(horaSalidaYMinutosB)) {
          if(parseFloat(horaLlegadaYMinutosA)>parseFloat(horaLlegadaYMinutosB)) {
            return 1;
          }
          if(parseFloat(horaLlegadaYMinutosA)<parseFloat(horaLlegadaYMinutosB)) {
            return -1;
          }
        }
        return 0;
      });
     
    // horario.operadores = this.operadores;  
    }
  }



  irDetalleRuta(horario: Horario) {
    this.rutasService.setHorarioDetalle(horario);
    this.router.navigate(['/tabs/ver-rutas/ruta-detalle/' + horario.idlinea]);
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

  expandirObjeto(): void {
    if (this.filtrosExpandidos) {
      this.filtrosExpandidos = false;
    } else {
        this.filtrosExpandidos = true; 
      
    }
  }

}
