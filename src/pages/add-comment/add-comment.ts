import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { CONFIG } from '../../providers/constants.js';

/**
 * Generated class for the AddComment page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-add-comment',
  templateUrl: 'add-comment.html',
})
export class AddCommentModal {

  rating: number = 0;
  comment: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams
                , public viewCtrl: ViewController, private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddComment');
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  accept(){
    if(this.isEmpty(this.comment)){
      let toast = this.toastCtrl.create({
        message: 'Por favor, llena el campo de comentarios',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return;
    }
    if(this.rating == 0){
      let toast = this.toastCtrl.create({
        message: 'La calificacion minima es 1',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return;
    }

    let data = {
      comment: this.comment,
      rating: this.rating
    }
    this.viewCtrl.dismiss(data);
  }

  isEmpty(data: string){
    return data.trim().length == 0 || data == null;
  }

}
