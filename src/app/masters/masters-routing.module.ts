import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MastersComponent } from './masters.component';
import { ShipComponent } from './ship/ship.component';
import { EstablishmentComponent } from './establishment-master/establishment-master.component';
import {  ManufacturerMasterComponent } from './manufacturer-master/manufacturer-master.component';

const routes: Routes = [
  {
    path: '',
    component: MastersComponent,
    children: [
      { path: '', redirectTo: 'ship-group', pathMatch: 'full' },
      {
        path: 'ship-group',
        loadChildren: () => import('./ship-master/ship-master.module').then(m => m.ShipMasterModule),
        data: {
          breadcrumb: 'Ship Master'
        },
      },
      {
        path: 'equipment-group',
        loadChildren: () => import('./equipment-master/equipment-master.module').then(m => m.EquipmentMasterModule)
      },
      {
        path: 'unit-group',
        loadChildren: () => import('./unit-master/unit-master.module').then(m => m.UnitMasterModule)
      },
      {
        path: 'overseeing-team',
        loadChildren: () => import('./over-seeing-team--master/over-seeing-team--master.module').then(m => m.OverSeeingTeamMasterModule)
      },
      {
        path: 'propulsion',
        loadChildren: () => import('./propulsion-master/propulsion-master.module').then(m => m.PropulsionMasterModule)
      },
      {
        path: 'country',
        loadChildren: () => import('./country-master/country-master.module').then(m => m.CountryMasterModule)
      },
      {
        path:'establishment',
        component:EstablishmentComponent
      },
      {
        path:'manufacturer',
        component:ManufacturerMasterComponent
      },
      { path: 'ship', component: ShipComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }
