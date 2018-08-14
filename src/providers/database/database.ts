import {Injectable} from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from 'angularfire2/firestore';

import {FCM} from '@ionic-native/fcm';

import 'firebase/storage';
import * as firebase from 'firebase/app';
import DocumentReference = firebase.firestore.DocumentReference;

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

//TODO: Implement FCM
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


  // DELETE
  submitJobRequest(data): Promise<DocumentReference> {
    return this.afs.collection('/jobRequests').add(data)
  }



}
