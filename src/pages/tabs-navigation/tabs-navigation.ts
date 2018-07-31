import { Component } from '@angular/core';

import { MapsPage } from '../maps/maps';
import { RequestDetailsPage } from '../request-details/request-details';
import { ListingPage } from '../listing/listing';
import { ProfilePage } from '../profile/profile';
import { NotificationsPage } from '../notifications/notifications';

@Component({
  selector: 'tabs-navigation',
  templateUrl: 'tabs-navigation.html'
})
export class TabsNavigationPage {
  tab1Root: any;
  tab2Root: any;
  tab3Root: any;

  constructor() {
    this.tab1Root = RequestDetailsPage;
    this.tab2Root = ProfilePage;
    this.tab3Root = NotificationsPage;
  }
}
