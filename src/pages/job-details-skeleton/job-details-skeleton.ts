import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {DatabaseProvider} from "../../providers/database/database";

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
  clientData: any;
  clientDataUnsub: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: DatabaseProvider
  ) {
    this.messageData = navParams.data;
    console.log(this.messageData.requestId);
    console.log(this.messageData.driverId);
  }

  ionViewWillLeave() {
    this.clientDataUnsub();
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
    this.db.lookupDriverProfile(this.messageData.driverId).valueChanges().subscribe(doc => {
      this.driverProfile = doc;
    });
  }

}
