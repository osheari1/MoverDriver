import { Component } from '@angular/core';
import {
  NavController,
  ModalController,
  LoadingController,
  Alert,
  AlertController
} from 'ionic-angular';

import {
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { EmailValidator } from '../../../validators/email';

import { TermsOfServicePage } from '../../terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../../privacy-policy/privacy-policy';

// import { FirebaseTabsNavigationPage } from '../firebase-tabs-navigation/firebase-tabs-navigation';
import { TabsNavigationPage } from '../../tabs-navigation/tabs-navigation';
import { FirebaseAuthService } from '../firebase-auth.service';




@Component({
  selector: 'firebase-signup-page',
  templateUrl: 'firebase-signup.html'
})
export class FirebaseSignupPage {
  signup: FormGroup;
  loading: any;
  errorMessage: string = '';

  constructor(
    public nav: NavController,
    public modal: ModalController,
    public loadingCtrl: LoadingController,
    public fAuthService: FirebaseAuthService,
    public alertCtrl: AlertController
  ) {

    this.signup = new FormGroup({
      email: new FormControl('',
        Validators.compose([Validators.required, EmailValidator.isValid])),
      password: new FormControl('test',
        Validators.compose([Validators.minLength(6), Validators.required])
      )
    });
  }


  doSignup(value) {
    this.fAuthService.doRegister(value)
      .then(res => {
        this.loading.dismiss().then(() => {
          this.nav.setRoot(TabsNavigationPage);
          }
        )
      }, err => {
        this.errorMessage = err.message
        const alert: Alert = this.alertCtrl.create({
          message: this.errorMessage,
          buttons: [
            {
              text: 'OK',
              role: 'cancel'
            }
          ]
        });
        alert.present();
      })
    this.loading = this.loadingCtrl.create();
    this.loading.present();
  }

  showTermsModal() {
    let modal = this.modal.create(TermsOfServicePage);
    modal.present();
  }

  showPrivacyModal() {
    let modal = this.modal.create(PrivacyPolicyPage);
    modal.present();
  }

  doFacebookSignup() {
    this.loading = this.loadingCtrl.create();
    this.fAuthService.doFacebookLogin()
      .then((res) => {
        this.nav.push(TabsNavigationPage);
        this.loading.dismiss();
      }, (err) => {
        this.errorMessage = err.message;
      });
  }

  doGoogleSignup() {
    this.loading = this.loadingCtrl.create();
    this.fAuthService.doGoogleLogin()
      .then((data) => {
        this.nav.push(TabsNavigationPage);
        this.loading.dismiss();
      }, (err) => {
        this.errorMessage = err.message;
      });
  }

  doTwitterSignup() {
    this.loading = this.loadingCtrl.create();
    this.fAuthService.doTwitterLogin()
      .then((data) => {
        this.nav.push(TabsNavigationPage);
        this.loading.dismiss();
      }, (err) => {
        this.errorMessage = err.message;
      });
  }

}
