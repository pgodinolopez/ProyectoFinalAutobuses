import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'ver-rutas',
        children: [
          {
            path: '',
            loadChildren: '../ver-rutas/ver-rutas.module#VerRutasPageModule'
          },
          {
            path: 'ruta-detalle/:idlinea',
            loadChildren: '../ruta-detalle/ruta-detalle.module#RutaDetallePageModule'
          },
        ]
      },
      {
        path: 'paradas-cercanas',
        children: [
          {
            path: '',
            loadChildren: '../paradas-cercanas/paradas-cercanas.module#ParadasCercanasPageModule'
          }
        ]
      },
      {
        path: 'rutas-favoritas',
        children: [
          {
            path: '',
            loadChildren: '../rutas-favoritas/rutas-favoritas.module#RutasFavoritasPageModule'
          },
          {
            path: 'ruta-detalle/:idlinea',
            loadChildren: '../ruta-detalle/ruta-detalle.module#RutaDetallePageModule'
          },
        ]
      },
      {
        path: 'login',
        children: [
          {
            path: '',
            loadChildren: '../login/login.module#LoginPageModule'
          }
        ]
      },
      {
        path: 'registro-usuario',
        children: [
          {
            path: '',
            loadChildren: '../registro-usuario/registro-usuario.module#RegistroUsuarioPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/ver-rutas',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/ver-rutas',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
