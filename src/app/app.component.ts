import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ListPage } from '../pages/list/list';
import { SplashPage } from '../pages/splash/splash';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OrderDetailPage } from '../pages/order-detail/order-detail';


import { OrdersPage } from '../pages/orders/orders';
import { LoginPage } from '../pages/login/login'; 
import { HelpPage } from '../pages/help/help';
import { StartPage } from '../pages/start/start';
import { TermsPage } from '../pages/terms/terms';


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
      { title: 'Inicio', component: StartPage },
      { title: 'Terminos', component: TermsPage},
      { title: 'Ayuda', component: HelpPage},
      { title: 'Mis Pedidos', component: OrdersPage }
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
    if(this.nav.getActive().component != page.component){
      this.nav.push(page.component);
    }
    // navigate to the new page if it is not the current page
  }
}
