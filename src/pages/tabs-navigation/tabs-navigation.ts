import { Component } from '@angular/core';

import { ProfilePage } from '../profile/profile';
import {CurrentJobsPage} from "../current-jobs/current-jobs";
import {PendingJobsPage} from "../pending-jobs/pending-jobs";
import {NavParams} from "ionic-angular";


@Component({
  selector: 'tabs-navigation',
  templateUrl: 'tabs-navigation.html'
})
export class TabsNavigationPage {
  tab1Root: any;
  tab2Root: any;
  tab3Root: any;


  constructor() {
    this.tab1Root = PendingJobsPage;
    this.tab2Root = ProfilePage;
    this.tab3Root = CurrentJobsPage;
  }

  ionViewDidLoad() {
  }


}
