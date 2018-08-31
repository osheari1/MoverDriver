import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
// import * as firebase from "firebase/app";
import {DatabaseProvider} from "../../providers/database/database";
import {AngularFirestoreCollection} from "angularfire2/firestore";
import {map} from "rxjs/operators";
import {JobDetailPage} from "../job-detail/job-detail";
import {FirebaseAuthService} from "../firebase-integration/firebase-auth.service";
import {Observable} from "rxjs";

/**
 * Generated class for the PendingJobsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pending-jobs',
  templateUrl: 'pending-jobs.html',
})
export class PendingJobsPage {

  jobRequestsCollection: AngularFirestoreCollection<any>;
  jobRequests: Observable<any[]>;
  dates: any;
  driverId: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private db: DatabaseProvider,
    private authService: FirebaseAuthService
  ) {

  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter PendingJobsPage');
    this.authService.getCurrentUser().then(user => {
      this.driverId = user.uid;

      this.jobRequestsCollection = this.db.queryJobRequests(
        ref => ref.where('pendingDriver', '==', this.driverId)
      );
      this.jobRequests = this.jobRequestsCollection
        .snapshotChanges()
        .pipe(
          map(actions => actions.map(
            a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              return {id, ...data};
            })),
        );

      this.dates = this.jobRequestsCollection
        .snapshotChanges()
        .pipe(
          map(actions => actions.map(
            a => {
              const data = a.payload.doc.data();
              // const id = a.payload.doc.id;
              return data.date;
            })));


    }, err => {
      console.log(err);
    });
  }

  goToJobRequestDetail(requestId: string) {
    this.navCtrl.push(JobDetailPage,
      {
        jobAcceptPage: true,
        requestId,
        driverId: this.driverId
      });
  }

}
