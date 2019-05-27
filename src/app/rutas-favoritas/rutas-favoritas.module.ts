import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RutasFavoritasPage } from './rutas-favoritas.page';

const routes: Routes = [
  {
    path: '',
    component: RutasFavoritasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RutasFavoritasPage]
})
export class RutasFavoritasPageModule {}
