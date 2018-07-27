import { Component } from '@angular/core';
import {
  IonicPage,
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

import { FirebaseAuthService } from '../firebase-auth.service';

/**
 * Generated class for the FirebaseForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-firebase-forgot-password',
  templateUrl: 'firebase-forgot-password.html',
})
export class FirebaseForgotPasswordPage {
  forgotPassword: FormGroup;
  loading: any;
  errorMessage: string = "";


  constructor(
    public nav: NavController,
    public loadingCtrl: LoadingController,
    public fAuthService: FirebaseAuthService,
    public alertCtrl: AlertController
  ) {

    this.forgotPassword = new FormGroup({
      email: new FormControl('',
        Validators.compose([Validators.required, EmailValidator.isValid]))
    });
  }

  doResetPassword(): void {
    if (!this.forgotPassword.valid) {
      console.log(this.forgotPassword.value)

    } else {
      this.fAuthService.doResetPassword(this.forgotPassword.value.email)
        .then(res => {
          this.loading.dismiss().then(() => {
            const alert: Alert = this.alertCtrl.create({
              message: "Sent password reset email!",
              buttons: [
                {
                  text: 'OK',
                  role: 'cancel',
                  handler: () => { this.nav.pop(); }
                }
              ]
            });
            alert.present();
          });
        },
        error => {
          this.errorMessage = error.message
          const alert: Alert = this.alertCtrl.create({
            message: this.errorMessage,
            buttons: [
              {
                text: 'OK',
                role: 'cancel',
                handler: () => { this.nav.pop(); }
              }
            ]
          });
          alert.present();
        });
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FirebaseForgotPasswordPage');
  }

}
