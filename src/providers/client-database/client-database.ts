import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import DocumentReference = firebase.firestore.DocumentReference;

/*
  Generated class for the ClientDatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ClientDatabaseProvider {

  constructor(
    public afs: AngularFirestore) {
  }

  createProfile(email: string, uid: string): Promise<any> {
    return this.afs.doc(`/clientProfile/${uid}`).set({
      email: email,
      uid: uid
    })
  }


  submitJobRequest(data): Promise<DocumentReference> {
    return this.afs.collection('/jobRequests').add(data)
  }

  lookupClientProfile(user): Promise<AngularFirestoreDocument<any>> {
    return new Promise<AngularFirestoreDocument<any>>((resolve, reject) => {
      let docRef: AngularFirestoreDocument<any> = this.afs.doc<any>(
        `/clientProfile/${user.uid}`);
      if (docRef) {
        resolve(docRef);
      } else {
        reject(docRef);
      }
    });
  }


}
