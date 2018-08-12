import { Component } from '@angular/core';

import { MapsPage } from '../maps/maps';
import { ProfilePage } from '../profile/profile';
import { NotificationsPage } from '../notifications/notifications';
import {ListingPage} from "../listing/listing";
import {ApprovalPage} from "../approval/approval";
import {CurrentJobsPage} from "../current-jobs/current-jobs";
import {HistoryPage} from "../history/history";


@Component({
  selector: 'tabs-navigation',
  templateUrl: 'tabs-navigation.html'
})
export class TabsNavigationPage {
  tab1Root: any;
  tab2Root: any;
  tab3Root: any;

  constructor() {
    this.tab1Root = HistoryPage;
    this.tab2Root = ProfilePage;
    this.tab3Root = CurrentJobsPage;
  }
}
