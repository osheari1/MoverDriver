import {Injectable} from '@angular/core';
import {
  AngularFirestore, AngularFirestoreCollection,
  AngularFirestoreDocument,
  // AngularFirestoreCollection
} from 'angularfire2/firestore';

import {FCM} from '@ionic-native/fcm';

import 'firebase/storage';
// import * as firebase from 'firebase/app';

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

  // TODO: Figure out where error comes from
  submitCompleteJob(requestId: string,
                    driverId: string,
                    requestData: any): Promise<void> {

    let acceptedDocRef = this.afs.doc(`jobAccept/${requestId}`);
    let completedDocRef = this.afs.doc(`jobComplete/${requestId}`);

    // Move data to jobComplete data base
    return completedDocRef.set(requestData, {merge: true}).then(() => {
      console.log(`Added jobRequest ${requestId} to jobComplete collection.`);
      // Dereference requestData
      requestData = null;
      // Remove entry from jobAccept collection
      return acceptedDocRef.delete().then(() => {
        console.log(`Removed jobRequest ${requestId} from jobAccept collection.`);
      }, err => {
        console.log('Error occurred in acceptDoc removal.', JSON.stringify(err));
      });
    }, err => {
      console.log('Error occurred in completeDoc set.', JSON.stringify(err));
    });
  }


  // TODO: Optimize update of jobAccepted update
  // TODO: Turn promise chains into async await calls
  acceptJobRequest(
    requestId: string,
    driverId: string,
    requestData: any
  ): Promise<void> {
    // Updates document in case a helper has already accepted
    let acceptedDocRef = this.afs.doc(`jobAccept/${requestId}`);
    let acceptRejectTimeoutRef = this.afs
      .collection(`acceptRejectTimeout`)
      .doc(`${requestId}`);

    return acceptRejectTimeoutRef.collection('drivers').doc(`${driverId}`)
      .set({timeout: false, reject: false, accept: true}).then(() => {
        // Move data to jobAccept data base
        return acceptedDocRef.set(requestData, {merge: true}).then(() => {
          // Add driverId
          return acceptedDocRef.update({driverId: driverId}).then(() => {
            console.log(`Added jobRequest ${requestId} to jobAccept database.`);
          }, err => {
            console.log('Error occurred in acceptDoc driverId update.', JSON.stringify(err));
          });
        }, err => {
          console.log('Error occurred in acceptDoc set.', JSON.stringify(err));
        });
      }, err => {
        console.log('Error occurred in acceptRejectTimeout set', JSON.stringify(err))
      });
  }

  timeoutJobRequest(requestId: string, driverId: string): Promise<void> {
    /*If driver timed out, reject job, but keep track of the fact they timed out
    * rather than actively rejecting it.
    * */
    let acceptRejectTimeoutRef = this.afs
      .collection(`acceptRejectTimeout`)
      .doc(`${requestId}`);

    // Add current drivers to rejected drivers
    return acceptRejectTimeoutRef
      .collection(`drivers`)
      .doc(`${driverId}`)
      .set({timeout: true, reject: false, accept: false}).then(() => {
        console.log(
          `Job request ${requestId} 
          was timed out by ${driverId}.`);
      }, err => {
        console.log(JSON.stringify(err));
      });
  }

  removePendingDriver(requestId: string, driverId: string): Promise<void> {
    let pendingDriverRef = this.afs
      .collection('jobRequests')
      .doc(`${requestId}`);
    return pendingDriverRef.set({pendingDriver: null}, {merge: true}).then(() => {
      console.log(`Removed driver ${driverId}s requestId ${requestId}s pendingDriver field`);
    }, err => {
      console.log(JSON.stringify(err));
    });
  }


  rejectJobRequest(requestId: string, driverId: string): Promise<void> {
    /*If driver timed out, reject job, but keep track of the fact they timed out
    * rather than actively rejecting it.
    * */
    let acceptRejectTimeoutRef = this.afs
      .collection(`acceptRejectTimeout`)
      .doc(`${requestId}`);

    // Add current drivers to rejected drivers
    return acceptRejectTimeoutRef.collection(`drivers`).doc(`${driverId}`)
      .set({timeout: false, reject: true, accept: false}).then(() => {
        console.log(
          `Job request ${requestId} 
          was rejected by ${driverId}.`);
      });
  }

  queryJobRequests(queryFnc = null): AngularFirestoreCollection<any> {
    if (queryFnc != null) {
      return this.afs.collection('jobRequests', queryFnc);
    }
    return this.afs.collection('jobRequests');
  }

  queryJobAccept(queryFnc = null): AngularFirestoreCollection<any> {
    if (queryFnc != null) {
      return this.afs.collection('jobAccept', queryFnc);
    }
    return this.afs.collection('jobAccept');
  }


  queryJobRequestDetails(id: string): AngularFirestoreDocument<any> {
    return this.afs.doc(`jobRequests/${id}`)
  }

  queryJobAcceptDetails(id: string): AngularFirestoreDocument<any> {
    return this.afs.doc(`jobAccept/${id}`)
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
        id: id,
        deviceToken: token
      });
    });
  }

  lookupDriverProfile(id): AngularFirestoreDocument<any> {
    return this.afs.doc<any>(`/driverProfile/${id}`);
  }
}
