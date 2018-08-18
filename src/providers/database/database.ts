import {Injectable, Provider} from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  // AngularFirestoreCollection
} from 'angularfire2/firestore';

import {FCM} from '@ionic-native/fcm';

import 'firebase/storage';
import * as firebase from 'firebase/app';
import DocumentReference = firebase.firestore.DocumentReference;
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import {Observable} from "rxjs";
import DocumentData = firebase.firestore.DocumentData;

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class DatabaseProvider {
  private mockToken: string = 'MOCK TOKEN';

  constructor(
    public afs: AngularFirestore,
    public fcm: FCM
  ) {
  }

  updateDriverToken(id: string): Promise<any> {
    //TODO: Remove mock tokens
    return this.fcm.getToken().then(token => {
      if (token == null) {
        token = this.mockToken;
      }
      this.afs.doc(`/driverProfile/${id}`).update({
        deviceToken: token
      });
    });
  }

  // TODO: Optimize update of jobAccepted update
  acceptJobRequest(
    requestId: string,
    driverId: string,
    requestData: any,
    driverProfile: any
  ): Promise<void> {
    // Updates document in case a helper has already accepted
    let acceptedDocRef = this.afs.doc(`jobAccept/${requestId}`);
    let requestDocRef = this.afs.doc(`jobRequests/${requestId}`);
    let driverProfileRef = this.afs.doc(`driverProfile/${driverId}`);

    // Move data to jobAccept data base
    return acceptedDocRef.set(requestData, {merge: true}).then(() => {
      // Add driverId
      return acceptedDocRef.update({driverId: driverId}).then(() => {
        console.log(`Added jobRequest ${requestId} to jobAccept database.`);
        // Remove old entry from DB
        return requestDocRef.delete().then(() => {
          console.log(`Deleted ${requestId} from jobRequest database`);
          // Add accepted job ID to driverProfile
          // Get current driver profile
          // Update accepted jobs list
          let acceptedJobs;
          if (driverProfile.acceptedJobs) {
            acceptedJobs = driverProfile.acceptedJobs;
            acceptedJobs.push(requestId);
          } else {
            acceptedJobs = [requestId];
          }
          return driverProfileRef.update({acceptedJobs: acceptedJobs})
            .then(() => {
              console.log(`Updated acceptedJobs list in driverProfile ${driverId}`);
            }, err => {
              console.log('Error occurred in driverProfile set', err);
            });

        }, err => {
          console.log('Error occurred in requestDoc delete.', err);
        });
      }, err => {
        console.log('Error occurred in acceptDoc driverId update.', err);
      });
    }, err => {
      console.log('Error occurred in acceptDoc set.', err);
    });
  }

  timeoutJobRequest(requestId: string, driverId: string, requestData: any): Promise<void> {
    /*If driver timed out, reject job, but keep track of the fact they timed out
    * rather than actively rejecting it.
    * */
    let requestDocRef = this.afs.doc(`jobRequests/${requestId}`);
    let timeoutDrivers;

    // Add current drivers to rejected drivers
    if (requestData.timeoutDrivers) {
      timeoutDrivers = requestData.timeoutDrivers;
      timeoutDrivers.push(driverId);
    }
    timeoutDrivers = [driverId];
    return requestDocRef.update({timeoutDrivers: timeoutDrivers}).then(() => {
      console.log(
        `Job request ${requestId} 
          was timed-out by ${driverId}.`);
    }, err => {
      console.log(err);
    });
  }

  rejectJobRequest(requestId: string, driverId: string, requestData: any): Promise<void> {
    let requestDocRef = this.afs.doc(`jobRequests/${requestId}`);
    let rejectedDrivers;

    // Add current drivers to rejected drivers
    if (requestData.rejectedDrivers) {
      rejectedDrivers = requestData.rejectedDrivers;
      rejectedDrivers.push(driverId);
    }
    rejectedDrivers = [driverId];
    return requestDocRef.update({rejectedDrivers: rejectedDrivers}).then(() => {
      console.log(
        `Job request ${requestId} 
          was rejected by ${driverId}.`);
    }, err => {
      console.log(err);
    });
  }

  queryJobRequestDetails(id: string): AngularFirestoreDocument<any> {
    return this.afs.doc(`jobRequests/${id}`)
  }

  checkIfDriverExists(id: string): Promise<boolean> {
    return this.afs.firestore.doc(`driverProfile/${id}`).get()
      .then(docSnapshot => {
        return docSnapshot.exists;
      });
  }

  createDriverProfile(email: string, id: string): Promise<any> {
    // First get device token
    //TODO: Remove mock tokens
    return this.fcm.getToken().then(token => {
      if (token == null) {
        token = this.mockToken;
      }
      this.afs.doc(`/driverProfile/${id}`).set({
        approved: false,
        email: email,
        uid: id,
        deviceToken: token
      });
    });
  }

  lookupDriverProfile(id): AngularFirestoreDocument<any> {
    return this.afs.doc<any>(`/driverProfile/${id}`);
  }


}
