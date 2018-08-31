import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CompleteJobPage} from './complete-job';

@NgModule({
  declarations: [
    CompleteJobPage,
  ],
  imports: [
    IonicPageModule.forChild(CompleteJobPage),
  ],
})
export class CompleteJobPageModule {
}
