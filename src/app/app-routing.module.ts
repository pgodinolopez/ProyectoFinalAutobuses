import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'ver-rutas', loadChildren: './ver-rutas/ver-rutas.module#VerRutasPageModule' },
  { path: 'paradas-cercanas', loadChildren: './paradas-cercanas/paradas-cercanas.module#ParadasCercanasPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
