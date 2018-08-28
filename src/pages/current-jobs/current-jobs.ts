import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFirestoreCollection} from "angularfire2/firestore";
import {Observable} from "rxjs";
import {DatabaseProvider} from "../../providers/database/database";
import {FirebaseAuthService} from "../firebase-integration/firebase-auth.service";
import {map} from "rxjs/operators";
import {JobDetailsSkeletonPage} from "../job-details-skeleton/job-details-skeleton";

/**
 * Generated class for the CurrentJobsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-current-jobs',
  templateUrl: 'current-jobs.html',
})
export class CurrentJobsPage {
  jobAcceptCollection: AngularFirestoreCollection<any>;
  jobAccept: Observable<any[]>;
  driverId: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private db: DatabaseProvider,
    private authService: FirebaseAuthService
  ) {

  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter CurrentJobsPage');
    this.authService.getCurrentUser().then(user => {
      this.driverId = user.uid;

      this.jobAcceptCollection = this.db.queryJobAccept(
        ref => ref.where('driverId', '==', this.driverId)
      );
      this.jobAccept = this.jobAcceptCollection
        .snapshotChanges()
        .pipe(
          map(actions => actions.map(
            a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              return {id, ...data};
            })),
        );
    }, err => {
      console.log(err);
    });
  }

  goToJobRequestDetail(requestId: string) {
    this.navCtrl.push(JobDetailsSkeletonPage,
      {
        requestId: requestId,
        driverId: this.driverId
      });
  }

}
