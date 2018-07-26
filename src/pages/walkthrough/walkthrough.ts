import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';

import { FirebaseSignupPage } from '../firebase-integration/firebase-signup/firebase-signup';
import { FirebaseLoginPage } from '../firebase-integration/firebase-login/firebase-login';

@Component({
  selector: 'walkthrough-page',
  templateUrl: 'walkthrough.html'
})
export class WalkthroughPage {

  lastSlide = false;

  @ViewChild('slider') slider: Slides;

  constructor(public nav: NavController) {

  }

  skipIntro() {
    // You can skip to main app
    // this.nav.setRoot(TabsNavigationPage);

    // Or you can skip to last slide (login/signup slide)
    this.lastSlide = true;
    this.slider.slideTo(this.slider.length());
  }

  onSlideChanged() {
    // If it's the last slide, then hide the 'Skip' button on the header
    this.lastSlide = this.slider.isEnd();
  }

  goToLogin() {
    this.nav.push(FirebaseLoginPage);
  }

  goToSignup() {
    this.nav.push(FirebaseSignupPage);
  }
}
