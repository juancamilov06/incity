import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { SplashPage } from '../pages/splash/splash';
import { SignUpPage } from '../pages/signup/signup';
import { ProfilePage } from '../pages/profile/profile';
import { StartPage } from '../pages/start/start';
import { PlacesPage } from '../pages/places/places';
import { PlacePage } from '../pages/place/place';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    SplashPage,
    LoginPage,
    SignUpPage,
    ProfilePage,
    StartPage,
    PlacesPage,
    PlacePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    Ionic2RatingModule,
    IonicStorageModule.forRoot({
      name: '__incity_local',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }), 
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    SplashPage,
    LoginPage,
    SignUpPage,
    ProfilePage,
    StartPage,
    PlacesPage,
    PlacePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})

export class AppModule {}
