import {Component} from '@angular/core';
import {NavController, NavParams, SegmentButton} from 'ionic-angular';
import {FormGroup} from "@angular/forms";
import {data} from "./data";
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

  options: any;

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
    this.options = data;  // Defines parameters around equipment options

    this.truckForm = new FormGroup({});
    this.largeTruckForm = new FormGroup({});
    this.boxVanForm = new FormGroup({});



  }


  onSegmentChanged(segmentButton: SegmentButton) {
    // console.log('Segment changed to', segmentButton.value);
  }

  onSegmentSelected(segmentButton: SegmentButton) {
    // console.log('Segment selected', segmentButton.value);
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad EquipmentOptionsPage');
  }

  submitJobRequest(): Promise<any> {
    return new Promise<any>(() => {
    })
  }

}
