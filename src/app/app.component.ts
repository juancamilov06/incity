import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ListPage } from '../pages/list/list';
import { SplashPage } from '../pages/splash/splash';
import { LoginPage } from '../pages/login/login';
import { SignUpPage } from '../pages/signup/signup';
import { ProfilePage } from '../pages/profile/profile';
import { StartPage } from '../pages/start/start';
import { PlacesPage } from '../pages/places/places';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PlacePage } from '../pages/place/place';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage = SplashPage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public app: App,
    public storage: Storage
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Inicio', component: StartPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout(){
    this.storage.ready().then(() => {
      this.storage.set('token', '').then(() => {
        this.app.getRootNav().setRoot(LoginPage);
      })
    });
  }

  close(){
    this.menu.close();
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.push(page.component);
    this.nav.setRoot(page.component);
  }
}
