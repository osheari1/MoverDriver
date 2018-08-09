import {Component} from '@angular/core';
import {NavController, NavParams, SegmentButton} from 'ionic-angular';
import {FormGroup} from "@angular/forms";
import {data} from "./data";
import {CalcUtilsProvider} from "../../providers/calc-utils/calc-utils";

/**
 * Generated class for the EquipmentOptionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
// TODO: Update jobRequest on segment change / update

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

  // This occurs any time the segmment is changed for any reason
  onSegmentChanged(segmentButton: SegmentButton) {
    console.log('Segment changed', segmentButton.value, this.section);

    this.updateJobRequest();

    console.log(this.jobRequest);
  }

  onSegmentSelected(segmentButton: SegmentButton) {
    console.log('Segment selected', segmentButton.value, this.section);
  }

  updateJobRequest() {
    // Update jobRequest with prices
    this.jobRequest = this.updateJobRequestObject({
      pricing: this.options[this.section]['pricing']
    });

    // do updates
    this.jobRequest = this.updateJobRequestObject({
      totalPrice: CalcUtilsProvider.calculatePriceViaMiles(
        this.jobRequest['pricing']['baseFee'],
        this.jobRequest['pricing']['minimumFee'],
        this.jobRequest['pricing']['feePerMile'],
        this.jobRequest['distance'])
    });

  }

  updateJobRequestObject(update: any) {
    return {
      ...this.jobRequest,
      ...update
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EquipmentOptionsPage');
    // Do update calculations
    this.updateJobRequest();

  }

  submitJobRequest(): Promise<any> {
    return new Promise<any>(() => {
    })
  }

}
