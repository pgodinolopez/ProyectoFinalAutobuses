import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VerRutasPage } from './ver-rutas.page';
import { ExpandableComponent } from '../componentes/expandable/expandable.component';

const routes: Routes = [
  {
    path: '',
    component: VerRutasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VerRutasPage, ExpandableComponent]
})
export class VerRutasPageModule {}
