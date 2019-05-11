import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ParadasCercanasPage } from './paradas-cercanas.page';

const routes: Routes = [
  {
    path: '',
    component: ParadasCercanasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ParadasCercanasPage]
})
export class ParadasCercanasPageModule {}
