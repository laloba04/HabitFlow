import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    BaseChartDirective,
    DashboardPageRoutingModule
  ],
  declarations: [DashboardPage],
  providers: [provideCharts(withDefaultRegisterables())]
})
export class DashboardPageModule {}
