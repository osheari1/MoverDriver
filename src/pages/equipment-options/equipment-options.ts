import {Component} from '@angular/core';
import {Alert, AlertController, LoadingController, NavController, NavParams, SegmentButton} from 'ionic-angular';
import {FormGroup} from "@angular/forms";
import {data} from "./data";
import {CalcUtilsProvider} from "../../providers/calc-utils/calc-utils";
import {FirebaseAuthService} from "../firebase-integration/firebase-auth.service";
import {DatabaseProvider} from "../../providers/database/database";
import {TabsNavigationPage} from "../tabs-navigation/tabs-navigation";
import * as firebase from 'firebase/app';

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

  // mockJobRequest = {
  //   canUseElevator: false,
  //   comments: "",
  //   date: "2018-08-08",
  //   time: "02:14",
  //   weight: 100,
  //   distance: 182833, // in meters
  //   duration: 6985, // travel time
  //   hasHardwood: false,
  //   image: null,
  //   locations: [new MapPlace(), new MapPlace()], // address, location
  //   needHelper: false,
  //   requiresBreakdown: false,
  //   selection: "LargeTruck",
  //   pricing: {
  //     baseFee: 10,
  //     minimumFee: 44.99,
  //     feePerMinute: 1.29,
  //     feePerMile: 3.5,
  //   }
  // };

  section: string;
  jobRequest: any;

  options: any;

  truckForm: FormGroup;
  largeTruckForm: FormGroup;
  boxVanForm: FormGroup;
  loading: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public fAuthService: FirebaseAuthService,
    public alertCtrl: AlertController,
    public db: DatabaseProvider,

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
    // this.jobRequest = this.mockJobRequest;
    this.updateJobRequest();

  }


  buildJobRequestMessage(): void {
    let update = {
      locations: this.jobRequest.locations.map(
        l => new firebase.firestore.GeoPoint(
          l.location.lat(),
          l.location.lng())),
      addresses: this.jobRequest.locations.map(l => l.address)
    };
    // Take everything as is from job request except lat lang
    let message = {
      ...this.jobRequest,
      ...update
    };
    return message;
  }


  submitJobRequest(): void {
    // Add current user id to job request
    this.fAuthService.getCurrentUser().then(user => {
      // Compile user info
      this.db.lookupDriverProfile(user.uid).then(userRef => {
        console.log(userRef.ref);
        this.jobRequest = this.updateJobRequestObject({
          clientRef: userRef.ref
        });

        // Build job request data blob
        console.log(this.jobRequest);
        let message = this.buildJobRequestMessage();
        console.log(message);
        // Add to requestDB
        this.db.submitJobRequest(message).then(docRef => {
          this.loading.dismiss().then(() => {
            const alert: Alert = this.alertCtrl.create({
              message: `Submitted job request ${docRef.id}`,
              buttons: [
                {
                  text: 'OK',
                  role: 'cancel',
                  handler: () => {
                    this.navCtrl.setRoot(TabsNavigationPage);
                  }
                }
              ]
            });
            alert.present();
          });
        }, err => {
          console.log('Could not submit job request');
          console.log(err);
        });
        this.loading = this.loadingCtrl.create();
        this.loading.present();
      }, err => {
        console.log(this.jobRequest);
        console.log(err);
      });
    }, err => {
      console.log(this.jobRequest);
      console.log(err);

    });
  }


}
