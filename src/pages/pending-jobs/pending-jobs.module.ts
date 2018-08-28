import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {PendingJobsPage} from './pending-jobs';

@NgModule({
  declarations: [
    PendingJobsPage,
  ],
  imports: [
    IonicPageModule.forChild(PendingJobsPage),
  ],
})
export class PendingJobsPageModule {
}
