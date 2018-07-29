import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

/**
 * Generated class for the RequestBasicJobPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-request-basic-job',
  templateUrl: 'request-basic-job.html',
})
export class RequestBasicJobPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad RequestBasicJobPage');
  }

}
