import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'ver-rutas', loadChildren: './ver-rutas/ver-rutas.module#VerRutasPageModule' },
  { path: 'paradas-cercanas', loadChildren: './paradas-cercanas/paradas-cercanas.module#ParadasCercanasPageModule' },
  { path: 'rutas-favoritas', loadChildren: './rutas-favoritas/rutas-favoritas.module#RutasFavoritasPageModule' },
  { path: 'ruta-detalle/:idlinea', loadChildren: './ruta-detalle/ruta-detalle.module#RutaDetallePageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'registro-usuario', loadChildren: './registro-usuario/registro-usuario.module#RegistroUsuarioPageModule' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
