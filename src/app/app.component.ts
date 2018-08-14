import { Component, ViewChild } from '@angular/core';
import {
  Platform,
  MenuController,
  // Nav,
  NavController,
  // App,
  ToastController
} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Observable } from 'rxjs/Observable';
import {FCM} from "@ionic-native/fcm";

import { TabsNavigationPage } from '../pages/tabs-navigation/tabs-navigation';
import { WalkthroughPage } from '../pages/walkthrough/walkthrough';
import { FirebaseLoginPage } from '../pages/firebase-integration/firebase-login/firebase-login';
import {FirebaseAuthService} from "../pages/firebase-integration/firebase-auth.service";

import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

// Firebase Auth
import { AngularFireAuth } from 'angularfire2/auth';


@Component({
  selector: 'app-root',
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild('navigator') navCtrl: NavController;
  // @ViewChild(Nav) nav: Nav;

  // make WalkthroughPage the root (or first) page
  // rootPage: any = WalkthroughPage;
  rootPage: any;
  // rootPage: any = TabsNavigationPage;

  // textDir: string = "rtl";
  textDir: string = "ltr";

  pages: Array<{title: any, icon: string, component: any}>;
  pushPages: Array<{title: any, icon: string, component: any}>;

  constructor(
    platform: Platform,
    public menu: MenuController,
    // public app: App,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    public translate: TranslateService,
    public toastCtrl: ToastController,
    public afAuth: AngularFireAuth,
    public authService: FirebaseAuthService,
    public fcm: FCM
  ) {

    // If the user is already logged in, will send to home page
    const authListener = afAuth.authState.subscribe(
     userCredential => {
       if (userCredential) {
         this.rootPage = TabsNavigationPage;
         authListener.unsubscribe();
       } else {
         this.rootPage = WalkthroughPage;
         authListener.unsubscribe();
       }
     });

    translate.setDefaultLang('en');
    translate.use('en');


    platform.ready().then(() => {
      // FCM
      fcm.onNotification().subscribe(data => {
        if (data.wasTapped) {
          // Notification was received on device tray and tapped by user
          this.handleWasTappedNotification(data);
        } else {
          // Notification wasreceivedd in foreground
          this.handleWasNotTappedNotification(data);
        }
      });

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.splashScreen.hide();
      this.statusBar.styleDefault();
    });

    this.translate.onLangChange.subscribe((event: LangChangeEvent) =>
      {
        if(event.lang == 'ar')
        {
          platform.setDir('rtl', true);
        }
        else
        {
          platform.setDir('ltr', true);
        }
        Observable.forkJoin(
          this.translate.get('HIRE_MOVER'),
          this.translate.get('HISTORY'),
          this.translate.get('PAYMENT'),
          this.translate.get('INVITE_FRIENDS'),
          this.translate.get('BECOME_A_DRIVER'),
          this.translate.get('SUPPORT'),
          this.translate.get('LOG_OUT'),
        ).subscribe(data => {
          this.pages = [
            { title: data[0], icon: 'bus', component: TabsNavigationPage },
            { title: data[1], icon: 'calendar', component: TabsNavigationPage },
            { title: data[2], icon: 'card', component: TabsNavigationPage },
            { title: data[3], icon: 'share', component: TabsNavigationPage },
            {title: data[4], icon: 'git-pull-request', component: TabsNavigationPage}
          ];

          this.pushPages = [
            {title: data[5], icon: 'help', component: TabsNavigationPage},
            { title: data[6], icon: 'log-out', component: FirebaseLoginPage }
          ];

        });
      });

  }

  handleWasTappedNotification(data) {
    console.log('Notification was tapped.');
    console.log(JSON.stringify(data));
    this.navCtrl.setRoot(TabsNavigationPage, data);
  }

  handleWasNotTappedNotification(data) {
    console.log('Notification was not tapped.');
    console.log(JSON.stringify(data));
    this.navCtrl.setRoot(TabsNavigationPage, data);
  }


  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.navCtrl.setRoot(page.component);
  }

  pushPage(page) {

    if (page.title == 'Log out') {
      this.authService.doLogout();
      this.menu.close();
      this.navCtrl.setRoot(WalkthroughPage);
      // this.app.getRootNav().push(WalkthroughPage);
    } else {

      // close the menu when clicking a link from the menu
      this.menu.close();
      // rootNav is now deprecated (since beta 11) (https://forum.ionicframework.com/t/cant-access-rootnav-after-upgrade-to-beta-11/59889)
      this.navCtrl.push(page.component);
      // this.app.getRootNav().push(page.component);
    }

  }
}
