import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {DatabaseProvider} from "../../providers/database/database";
import {CompleteJobPage} from "../complete-job/complete-job";

/**
 * Generated class for the JobDetailsSkeletonPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-job-details-skeleton',
  templateUrl: 'job-details-skeleton.html',
})
export class JobDetailsSkeletonPage {
  messageData: any;
  data$: any;
  data: any;
  driverProfile: any;
  driverProfileUnsub: any;
  clientData: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: DatabaseProvider
  ) {
    this.messageData = navParams.data;
  }

  // TODO: Find error after ionViewDidLeave
  goToCompleteJobPage() {
    console.log('Triggered goToCompleteJobPage');
    this.navCtrl.push(
      CompleteJobPage,
      {
        requestId: this.messageData.requestId,
        driverId: this.messageData.driverId,
        jobData: this.data
      }
    )
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave JobDetailsSkeletonPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JobDetailsSkeletonPage');

    this.data$ = this.db.queryJobAcceptDetails(this.messageData.requestId).valueChanges();
    this.data$.subscribe(doc => {
      this.data = doc;

      // Extract client data
      doc.clientRef.onSnapshot(snap => {
        this.clientData = snap;
      });
    });

    // Query driver profile
    this.driverProfileUnsub = this.db.lookupDriverProfile(this.messageData.driverId).valueChanges().subscribe(doc => {
      this.driverProfile = doc;
    });
  }

}
