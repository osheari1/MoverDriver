import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {DatabaseProvider} from "../../providers/database/database";

/**
 * Generated class for the CompleteJobPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-complete-job',
  templateUrl: 'complete-job.html',
})
export class CompleteJobPage {

  requestId: string;
  driverId: string;
  jobData: any;

  totalTime: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: DatabaseProvider
  ) {
    this.requestId = this.navParams.data.requestId;
    this.driverId = this.navParams.data.driverId;
    this.jobData = this.navParams.data.jobData;
  }


  ionViewDidLeave() {
    console.log('ionViewDidLeave CompleteJobPage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter CompleteJobPage');
    // this.driverDataUnsub = this.db.lookupDriverProfile(this.driverId)
    //   .valueChanges()
    //   .subscribe(doc => {
    //     this.driverProfile = doc;
    //   });
  }

  submitComplete() {
    // console.log(this.totalTime);
    let jobData = {
      ...this.jobData,
      ...{
        totalTime: 0
      }
    };

    this.db.submitCompleteJob(
      this.requestId,
      this.driverId,
      jobData
    );
    this.navCtrl.goToRoot({
      animate: true,
      direction: 'back'
    });
  }

}
