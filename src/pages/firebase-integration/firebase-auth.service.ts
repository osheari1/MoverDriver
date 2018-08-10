import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/toPromise';
import * as firebase from 'firebase/app';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { AngularFirestore } from 'angularfire2/firestore';
import {AngularFireAuth} from "angularfire2/auth";

// import { environment } from '../../environment/environment';

@Injectable()
export class FirebaseAuthService {

  // FB_APP_ID: number = environment.facebook_app_id;

  constructor(
    public afAuth: AngularFireAuth,
    public afStore: AngularFirestore,
    public googlePlus: GooglePlus,
    public fb: Facebook,
    public tw: TwitterConnect,
    public platform: Platform,
    public afs: AngularFirestore

  ) {
    // this.fb.browserInit(this.FB_APP_ID, "v2.8");
  }

  doResetPassword(email: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.sendPasswordResetEmail(email).then(
        res => {
          resolve(res);
        },
        error => reject(error))
    });
  }


  doLogin(value): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(value.email, value.password)
        .then(res => {
          resolve(res);
        }, err => reject(err))
    })
  }

  doLogout(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.auth.signOut();
        resolve();
      }
      else {
        reject();
      }
    });
  }

  getCurrentUser(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          resolve(user);
        } else {
          reject('No user logged in');
        }
      });
    });
  }

  getUserImage(personId) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('/user').doc(personId).valueChanges()
        .subscribe(snapshots => {
          if (snapshots) {
            resolve(snapshots);
          } else {
            reject()
          }
        })
    });
  }

  updateFormValues(value: any) {
    return new Promise((resolve, reject) => {
      var user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: value.name,
        photoURL: user.photoURL
      }).then(res => {
        resolve(res)
      }, err => reject(err))
    })
  }

  updatePhotoUrl(value: any) {
    return new Promise((resolve, reject) => {
      var user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: user.displayName,
        photoURL: value
      }).then(res => {
        resolve(res)
      }, err => reject(err))
    })
  }

  doGoogleLogin() {
    return new Promise<any>((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.googlePlus.login({
          'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
          'webClientId': '303898922125-3brpjnae600h5pkoqsh4misvvmpokkm4.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
          'offline': true
        }).then((response) => {
          const googleCredential = firebase.auth.GoogleAuthProvider.credential(response.idToken);
          firebase.auth().signInWithCredential(googleCredential)
            .then((user) => {
              resolve({
                userId: user.id,
                name: user.displayName,
                image: user.photoUrl
              })
            });
        }, (err) => {
          reject(err);
        });
      }
      else {
        this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
          .then((user) => {
            resolve({
              userId: user.id,
              name: user.displayName,
              image: user.photoUrl
            })
          })
      }
    })
  }


  // doRegister(value): Promise<any> {
  //   return new Promise<any>((resolve, reject) => {
  //     this.afAuth.auth.createUserWithEmailAndPassword(value.email, value.password)
  //       .then(res => {
  //         resolve(res);
  //       }, err => reject(err))
  //   })
  // }
  doRegister(value): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(value.email, value.password)
  }


  doFacebookLogin() {
    return new Promise<any>((resolve, reject) => {
      if (this.platform.is('cordova')) {
        //["public_profile"] is the array of permissions, you can add more if you need
        this.fb.login(["public_profile"]).then((response) => {
          const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
          firebase.auth().signInWithCredential(facebookCredential);
          //Getting name and gender properties
          this.fb.api("/me?fields=name,gender", [])
            .then((user) => {
              resolve({
                userId: user.id,
                name: user.name,
                gender: user.gender,
                image: "https://graph.facebook.com/" + user.id + "/picture?type=large"
              })
            });
        }, (err) => {
          reject(err);
        });
      }
      else {
        this.afAuth.auth
          .signInWithPopup(new firebase.auth.FacebookAuthProvider())
          .then((user) => {
            resolve({
              user
            })
          })
      }
    })
  }

  doTwitterLogin() {
    return new Promise<any>((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.tw.login().then((response) => {
          const twitterCredential = firebase.auth.TwitterAuthProvider.credential(response.token, response.secret);
          firebase.auth().signInWithCredential(twitterCredential)
            .then(
            (user) => {
              resolve({
                name: user.displayName,
                image: user.photoURL,
                provider: ""
              })
            },
            (error) => {
              reject(error);
            });
        }, (err) => {
          reject(err);
        });
      }
      else {
        this.afAuth.auth
          .signInWithPopup(new firebase.auth.TwitterAuthProvider())
          .then((user) => {
            resolve({
              name: user.displayName,
              image: user.photoURL,
              provider: ""
            })
          })
      }
    })
  }

}
