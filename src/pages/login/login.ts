import { Component } from '@angular/core';
import { Http, Headers  } from '@angular/http';
import {NavController, NavParams , AlertController, LoadingController, MenuController} from 'ionic-angular';
import { SignUpPage } from '../signup/signup'
import { StartPage } from '../start/start'
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  value: boolean = false;
  mail: string;
  password: string;

  constructor(public navCtrl: NavController, public navParams: NavParams
                  , public alertCtrl: AlertController, public http: Http
                  , public storage: Storage, public loading: LoadingController
                  , public menu: MenuController) {
    this.mail = '';
    this.password = '';
    this.http = http;
    this.menu.enable(false);
  }

  signUp(){
    this.navCtrl.push(SignUpPage);
  }

  login(){

    if(this.isEmpty(this.mail) || this.isEmpty(this.password)){
      this.showEmptyAlert();
      return;
    }

    let loader = this.loading.create({content: "Espera un momento"});
    loader.present();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let body = new FormData();
    body.append('mail', this.mail);
    body.append('password', this.password);

    this.http.post('https://incitybackend.000webhostapp.com/auth', body, headers)
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
          loader.dismiss();
          if(data.success == false && data.code == 200){
            let alert = this.alertCtrl.create({
              title: 'Datos incorrectos',
              subTitle: 'Las credenciales son incorrectas, intentalo de nuevo',
              buttons: ['OK']
            });
            alert.present();
          }            
          if (data.success == true && data.code == 200){
            this.storage.ready().then(() => {
              this.storage.set('token', '').then(() => {
                this.storage.set('token', data.data.token).then(() => {
                  this.start();
                });
              });
            });
          }
        }, error => {
            console.log(error);
            loader.dismiss();
            let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'Intentelo de nuevo mas tarde',
            buttons: ['OK']
          });
          alert.present();
        });
    
  }

  start(){
    this.navCtrl.push(StartPage).then(() => {
      const index = this.navCtrl.getActive().index;
      this.navCtrl.remove(0, index);
    });
  }

  showEmptyAlert() {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'Debes ingresar todos los campos',
      buttons: ['OK']
    });
    alert.present();
  }

  isEmpty(str: string){
    return str.trim().length == 0
  }

  openLogin(){
    if(this.value == false){
      this.value = true;
    } else {
      this.value = false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
    this.value = false;
  }
}
