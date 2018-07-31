import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormJobInfoPage } from './form-job-info';

@NgModule({
  declarations: [
    FormJobInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(FormJobInfoPage),
  ],
})
export class FormJobInfoPageModule {}
