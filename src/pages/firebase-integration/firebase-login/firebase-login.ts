import { Component } from '@angular/core';
import {
  NavController,
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

import { FirebaseForgotPasswordPage } from '../firebase-forgot-password/firebase-forgot-password';
import { TabsNavigationPage } from '../../tabs-navigation/tabs-navigation';
import { FirebaseSignupPage } from '../firebase-signup/firebase-signup';
import { FirebaseAuthService } from '../firebase-auth.service';
import {DatabaseProvider} from "../../../providers/database/database";

@Component({
  selector: 'firebase-login-page',
  templateUrl: 'firebase-login.html'
})
export class FirebaseLoginPage {
  login: FormGroup;
  loading: any;
  errorMessage: string = '';

  constructor(
    public nav: NavController,
    public loadingCtrl: LoadingController,
    public fAuthService: FirebaseAuthService,
    public alertCtrl: AlertController,
    public db: DatabaseProvider,
  ) {
    this.login = new FormGroup({
      email: new FormControl('',
        Validators.compose([Validators.required, EmailValidator.isValid])),
      password: new FormControl('test',
        Validators.compose([Validators.minLength(6), Validators.required])
      )
    });
  }

  doLogin(value) {
    this.fAuthService.doLogin(value)
      .then(res => {
        let id = res.uid;
        // Create driver profile if account already exists but profile does not
        this.db.checkIfDriverExists(id).then(exists => {
          if (!exists) {
            this.db.createDriverProfile(value.email, id).then(() => {
            }, err => {
              console.log(err);
            });
          } else {
            this.db.updateDriverToken(id).then(() => {
              },
              err => {
                console.log(err);
              });
          }
        }).then(() => {
          this.loading.dismiss().then(() => {
            this.nav.setRoot(TabsNavigationPage);
          });
        }, err => {
          console.log('Could not pull device token');
          console.log(err);
        });
      }, err => {
        this.loading.dismiss().then(() => {
          this.errorMessage = err.message;
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

        });
      });
    this.loading = this.loadingCtrl.create();
    this.loading.present();
  }

  doFacebookLogin() {
    this.loading = this.loadingCtrl.create();
    this.fAuthService.doFacebookLogin()
      .then((_) => {
        this.nav.push(TabsNavigationPage);
        this.loading.dismiss();
      }, (err) => {
        this.errorMessage = err.message;
      });
  }

  doGoogleLogin() {
    this.loading = this.loadingCtrl.create();
    this.fAuthService.doGoogleLogin()
      .then((_) => {
        this.nav.push(TabsNavigationPage);
        this.loading.dismiss();
      }, (err) => {
        this.errorMessage = err.message;
      });
  }

  doTwitterLogin() {
    this.loading = this.loadingCtrl.create();
    this.fAuthService.doTwitterLogin()
      .then((_) => {
        this.nav.push(TabsNavigationPage);
        this.loading.dismiss();
      }, (err) => {
        this.errorMessage = err.message;
      });
  }

  goToSignup() {
    this.nav.push(FirebaseSignupPage);
  }

  goToForgotPassword() {
    this.nav.push(FirebaseForgotPasswordPage);
  }
}
