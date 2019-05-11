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
          }
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
      // {
      //   path: 'tab3',
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: '../tab3/tab3.module#Tab3PageModule'
      //     }
      //   ]
      // },
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
