import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FirebaseForgotPasswordPage } from './firebase-forgot-password';

@NgModule({
  declarations: [
    FirebaseForgotPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(FirebaseForgotPasswordPage),
  ],
})
export class FirebaseForgotPasswordPageModule {}
