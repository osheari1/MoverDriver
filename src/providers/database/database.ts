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

  // TODO: Accept job request
  // TODO: Reject job request
  // TODO: Add handler for simple timeouts
  // TODO: Optimize update of jobAccepted update
  acceptJobRequest(requestId: string, driverId: string, requestData: any): Promise<any> {
    // Create new entry in acceptedJobs database
    // Updates document in case a helper has already accepted
    let acceptedDocRef = this.afs.doc(`jobAccept/${requestId}`);
    // let requestDocRef = this.afs.doc(`jobRequests/${requestId}`);

    return acceptedDocRef.set(requestData, {merge: true}).then(() => {
      return acceptedDocRef.update({driverId: driverId}).then(
        () => console.log(`Added jobRequest ${requestId} to jobAccept database.`),
        err => console.log(err)
      );
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

  lookupDriverProfile(id): Promise<AngularFirestoreDocument<any>> {
    return new Promise<AngularFirestoreDocument<any>>((resolve, reject) => {
      let docRef: AngularFirestoreDocument<any> = this.afs.doc<any>(
        `/driverProfile/${id}`);
      if (docRef) {
        resolve(docRef);
      } else {
        reject(`Could not get document.`);
      }
    });
  }


}
