import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import { CONFIG } from '../../providers/constants.js';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the Help page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {

  hideFaqList: boolean = false;
  hideContactItem: boolean = false;
  hideWeItem: boolean = false;

  content: string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams
                    , public menu: MenuController, public loading: LoadingController
                    , public storage: Storage, public http: Http, public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Help');
  }

  checkData(){
    if(this.content.trim().length > 0){
      this.sendFeedback(this.content);
    } else {
      let toast = this.toastCtrl.create({
          message: 'Debes ingresar algun comentario',
          duration: 3000,
          position: 'top'
      });
      toast.present();
    }
  }

  sendFeedback(content: string){
    let loader = this.loading.create({content: "Espera un momento"});
    loader.present();

    let body = new FormData();
    body.append('data', content);

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.storage.ready().then(() => {
      this.storage.get('token').then((token) => {
        console.log(token);
        this.http.post('http://' + CONFIG.host +'/faq/create?token=' + token, body, headers)
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
          loader.dismiss();
          if(data.success == true){
            this.content = '';
            let toast = this.toastCtrl.create({
              message: 'Gracias por enviar tu mensaje',
              duration: 3000,
              position: 'top'
            });
            toast.present();
          } else {
            let toast = this.toastCtrl.create({
              message: 'Error, intenta luego',
              duration: 3000,
              position: 'top'
            });
            toast.present();
          }
        }, error => {
          loader.dismiss();
          console.log(error);
        });
      });
    }); 
  }



  hideFaq(){
    if(this.hideFaqList == false){
      this.hideFaqList = true;
    } else {
      this.hideFaqList = false;
    }
  }

  hideContact(){
    if(this.hideContactItem == false){
      this.hideContactItem = true;
    } else {
      this.hideContactItem = false;
    }
  }

  hideWe(){
    if(this.hideWeItem == false){
      this.hideWeItem = true;
    } else {
      this.hideWeItem = false;
    }
  }

  back(){
    this.navCtrl.pop();
  }

  open(){
    this.menu.open();
  }

}
