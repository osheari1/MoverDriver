import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {DatabaseProvider} from "../../providers/database/database";
import {Observable} from "rxjs";
import {TabsNavigationPage} from "../tabs-navigation/tabs-navigation";

/**
 * Generated class for the JobDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-job-detail',
  templateUrl: 'job-detail.html',
})
export class JobDetailPage {
  messageData: any;
  requestData$: any;
  requestData: any;
  driverProfile: any;
  clientData: any;
  clientDataUnsub: any;
  driverDataUnsub: any;

  // Timer variables
  timerInterval: number = 1;
  timerCurrent: number = 0;
  timerMax: number = 10;
  timerFinished: boolean = false;
  initTimerDelay: number = 5;
  accepted: boolean;
  timeout: boolean;

  jobAcceptPage: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: DatabaseProvider
  ) {
    // Get jobRequestID to query
    this.messageData = navParams.data;
    this.jobAcceptPage = this.messageData.jobAcceptPage ? this.messageData.jobAcceptPage : true;
  }

  startTimer() {
    console.log('Starting timer');
    const interval = Observable.interval(this.timerInterval * 1000);
    interval.takeWhile(_ => !this.timerFinished)
      .do(i => this.timerCurrent += this.timerInterval)
      .subscribe();
  }

  acceptJob(): void {
    // Remove pendingDriver from data
    if (this.requestData.pendingDriver) {
      delete this.requestData.pendingDriver
    }
    // this.clientDataUnsub();
    this.db.acceptJobRequest(
      this.messageData.requestId,
      this.messageData.driverId,
      this.requestData
    )
  }

  rejectJob(): void {
    this.db.rejectJobRequest(
      this.messageData.requestId,
      this.messageData.driverId);

  }

  timeoutJob(): void {
    this.db.timeoutJobRequest(
      this.messageData.requestId,
      this.messageData.driverId);

  }

  finishTimer(): void {
    this.timerFinished = true;
  }

  setAccept() {
    this.finishTimer();
    // Clean up  reference to client data

    this.accepted = true;
    this.timeout = false;
    this.navCtrl.setRoot(TabsNavigationPage);
  }

  setReject() {
    this.finishTimer();
    this.accepted = false;
    this.timeout = false;
    this.navCtrl.setRoot(TabsNavigationPage);
  }

  setTimeout() {
    this.finishTimer();
    this.timeout = true;
    this.accepted = false;
  }

  get isFinished() {
    if (this.timerCurrent >= this.timerMax) {
      this.timerFinished = true;
      this.setTimeout()
    }
    return this.timerFinished
  }

  get maxVal() {
    return isNaN(this.timerMax) || this.timerMax < this.timerInterval ? this.timerInterval : this.timerMax;
  }

  get currentVal() {
    return isNaN(this.timerCurrent) || this.timerCurrent < 0 ? 0 : this.timerCurrent;
  }

  ionViewWillLeave() {
    this.clientDataUnsub();
    this.driverDataUnsub();
  }

  ionViewDidLeave() {
    this.db.removePendingDriver(
      this.messageData.requestId,
      this.messageData.driverId);
    if (this.accepted) {
      this.acceptJob();
    } else if (!this.accepted && !this.timeout) {
      this.rejectJob();
    } else if (!this.accepted && this.timeout) {
      this.timeoutJob();
    }
  }

  ionViewDidLoad() {
    // TODO: Figure where that error is coming from
    console.log('ionViewDidLoad JobDetailPage');
    this.requestData$ = this.db.queryJobRequestDetails(this.messageData.requestId).valueChanges();
    this.requestData$.subscribe(doc => {
      this.requestData = doc;

      // Extract client data
      this.clientDataUnsub = doc.clientRef.onSnapshot(snap => {
        this.clientData = snap;
      });
    });

    // Query driver profile
    this.driverDataUnsub = this.db.lookupDriverProfile(this.messageData.driverId).valueChanges().subscribe(doc => {
      this.driverProfile = doc;
    });


    // TODO: add a start time delay
    // Timer logic
    this.startTimer()
  }


}
