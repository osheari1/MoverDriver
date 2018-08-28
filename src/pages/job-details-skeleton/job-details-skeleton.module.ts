import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {JobDetailsSkeletonPage} from './job-details-skeleton';

@NgModule({
  declarations: [
    JobDetailsSkeletonPage,
  ],
  imports: [
    IonicPageModule.forChild(JobDetailsSkeletonPage),
  ],
})
export class JobDetailsSkeletonPageModule {
}
