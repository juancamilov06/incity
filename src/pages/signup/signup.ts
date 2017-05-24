import { Component } from '@angular/core';
import {NavController, NavParams, AlertController, LoadingController, MenuController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { StartPage } from '../start/start';
import { CONFIG } from '../../providers/constants.js';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignUpPage {

  firstName: string = '';
  lastName: string = '';
  mail: string = '';
  address: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  checked: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams
                      , public http: Http, public alertCtrl: AlertController
                      , public loading: LoadingController, public storage: Storage
                      , public menu: MenuController) {
    this.http = http;
    this.menu.enable(false);
  }

  showAlert(message: string, title: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  signUp(){
    if(this.isEmpty(this.firstName) || this.isEmpty(this.lastName) 
            || this.isEmpty(this.mail) || this.isEmpty(this.password)
            || this.isEmpty(this.phone) || this.isEmpty(this.address)){
              this.showAlert('Debes llenar todos los campos', 'Error');
              return;
    }
    if(!this.validateEmail(this.mail)){
      this.showAlert('Email invalido', 'Error');
      return;
    }
    if(this.password !== this.confirmPassword){
      this.showAlert('Las contraseñas deben ser iguales', 'Error');
      return;
    }
    if(!this.checked){
      this.showAlert('Acepta los terminos y condiciones', 'Error');
      return;
    }

    let loader = this.loading.create({content: "Espera un momento"});
    loader.present();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let data = {
      'firstName': this.firstName,
      'lastName': this.lastName,
      'mail': this.mail,
      'password': this.password,
      'address' : this.address,
      'phone': this.phone
    }

    let body = new FormData();
    body.append('data', JSON.stringify(data));
    this.http.post('http://' + CONFIG.host +'/incity/api/auth/create', body, headers)
        .map(res => res.json())
        .subscribe(data => {
          loader.dismiss();
          console.log(data);
          if(data.success == false && data.code == 500){
            this.showAlert('El usuario con el correo ingresado ya existe', 'Error');
          }
          if(data.success == false && data.code == 200){
            this.showAlert('Usuario creado, inicia sesion', 'Creacion exitosa');
          }
          if (data.success == true && data.code == 200){
            this.storage.ready().then(() => {
              this.storage.set('token', '').then(() => {
                this.storage.set('token', data.data.token).then(() => {
                  this.storage.set('exp', data.data.expiration).then(() => {
                    this.storage.set('city_id', '1').then(() => {
                      this.start();
                    });
                  });
                });
              });              
            });
          }
        }, error => {
            console.log(error);
            loader.dismiss();
            this.showAlert('Intente de nuevo mas tarde', 'Error');
        });
  }

  start(){
    this.navCtrl.push(StartPage).then(() => {
      const index = this.navCtrl.getActive().index;
      this.navCtrl.remove(0, index);
    });
  }

  validateEmail(email: string) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  isEmpty(str: string){
    if(str){
      return str.trim().length == 0
    }
    return true;
  }

  back(){
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUp');
  }
}