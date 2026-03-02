import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LottieComponent } from 'ngx-lottie';

import { HabitsPageRoutingModule } from './habits-routing.module';
import { HabitsPage } from './habits.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    HabitsPageRoutingModule,
    LottieComponent
  ],
  declarations: [HabitsPage]
})
export class HabitsPageModule {}
