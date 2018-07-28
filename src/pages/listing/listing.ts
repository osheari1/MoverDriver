import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { FeedPage } from '../feed/feed';
import 'rxjs/Rx';

// Image provider
import { ImageProvider } from '../../providers/image/image';

import {
  // ListingModel,
  LandingModel } from './listing.model';
// import { ListingService } from './listing.service';


@Component({
  selector: 'listing-page',
  templateUrl: 'listing.html',
})
export class ListingPage {
  listing: LandingModel = new LandingModel();

  constructor(
    public nav: NavController,
    public imageProvider: ImageProvider
  ) {}

  ionViewDidLoad() {
    this.imageProvider
      .getData()
      .then(data => {
        this.listing.banner_image = data.banner_image;
        this.listing.banner_title = data.banner_title;
        this.listing.services = data.services;
      });
  }

  goToPage(service: any) {

  }
  // goToFeed(category: any) {
  //   console.log("Clicked goToFeed", category);
  //   this.nav.push(FeedPage, { category: category });
  // }

}
