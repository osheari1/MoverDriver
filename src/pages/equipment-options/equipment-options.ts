import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {FormGroup} from "@angular/forms";

/**
 * Generated class for the EquipmentOptionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-equipment-options',
  templateUrl: 'equipment-options.html',
})
export class EquipmentOptionsPage {
  section: string;
  jobRequest: any;

  truckForm: FormGroup;
  largeTruckForm: FormGroup;
  boxVanForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.section = "truck";
    // Keep job request from previous page
    this.jobRequest = navParams.data;

    this.truckForm = new FormGroup({});
    this.largeTruckForm = new FormGroup({});
    this.boxVanForm = new FormGroup({});



  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EquipmentOptionsPage');
  }

  submitJobRequest(): Promise<any> {
    return new Promise<any>(() => {
    })
  }

}
