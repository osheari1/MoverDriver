import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CurrentJobsPage} from './current-jobs';

@NgModule({
  declarations: [
    CurrentJobsPage,
  ],
  imports: [
    IonicPageModule.forChild(CurrentJobsPage),
  ],
})
export class CurrentJobsPageModule {
}
