import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController
                  , LoadingController, ModalController, ToastController
                  , ViewController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { CONFIG } from '../../providers/constants.js';

/**
 * Generated class for the ShoppingCart page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-shopping-cart',
  templateUrl: 'shopping-cart.html',
})
export class ShoppingCartPage {

  place: any;
  
  orderItems: Array<any> = new Array();
  additions: Array<any> = new Array();

  hasAdditions: boolean = false;

  orderItemsTotal: number = 0;
  additionsTotal: number = 0;
  orderTotal: number = 0;
  delivery: number = 0;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
                        public viewCtrl: ViewController, public alertCtrl: AlertController,
                        public toastCtrl: ToastController, public http: Http,
                        public storage: Storage, public loading: LoadingController) {
    this.orderItems = navParams.get('order_items');
    this.additions = navParams.get('additions');
    this.place = navParams.get('place');
    this.initViews();
  }

  getCurrentAddress(){

    let loader = this.loading.create({content: "Espera un momento"});
    loader.present();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.storage.ready().then(() => {
      this.storage.get('token').then((token) => {
        this.http.get('http://' + CONFIG.host +'/incity/api/user/?token=' + token, headers)
          .map(res => res.json())
          .subscribe(data => {
            loader.dismiss();
            this.confirmAddress(data.data);
            console.log(data);
          }, error => {
            loader.dismiss();
            console.log(error);
          });
      });
    });
  }



  confirmAddress(user){
    var address = user.address;
    let confirm = this.alertCtrl.create({
        title: 'Confirmar direccion',
        message: 'Enviaremos el pedido a la direccion: ' + address.bold() + ' ¿Deseas continuar?',
        buttons: [
          {
            text: 'No, cambiar',
            handler: () => {
              this.changeAddress();
            }
          },
          {
            text: 'Si',
            handler: () => {
              this.createOrder(address);
            }
          }
        ]
      });
      confirm.present();   
  }

  changeAddress(){

    let prompt = this.alertCtrl.create({
      title: 'Cambiar direccion',
      message: "Ingresa la direccion a la que quieres que te enviemos el pedido",
      inputs: [
        {
          name: 'address',
          placeholder: 'Direccion'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            
          }
        },
        {
          text: 'Pedir',
          handler: data => {
            this.createOrder(data.address);
          }
        }
      ]
    });
    prompt.present();

  }

  createOrder(address){

    let itemsToSend = new Array();
    this.orderItems.forEach(element => {
      itemsToSend.push(element);
    });    
    this.additions.forEach(element => {
      itemsToSend.push(element);
    });

    let data = {
      items: itemsToSend,
      restaurant: this.place,
      total: this.orderTotal,
      address: address
    }

    let loader = this.loading.create({content: "Espera un momento"});
    loader.present();

    let body = new FormData();
    body.append('data', JSON.stringify(data));

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.storage.ready().then(() => {
      this.storage.get('token').then((token) => {
        this.http.post('http://www.sepuedegroup.com/incity/api/order?token='+token, body, headers)
        .map(res => res.json())
        .subscribe(data => {
          loader.dismiss();
          if(data.success == true && data.order){
            this.toastCtrl.create({
              message: 'Pedido con codigo ' + data.order.code + ' creado',
              duration: 3000,
              position: 'top'
            }).present();
            this.complete();
          }
        }, error => {
          loader.dismiss();
          console.log(error);
        });
      });
    });

  }

  addAddition(item){
    item.quantity = item.quantity + 1;
    this.updateAdditionQuantity(item);
  }

  removeAddition(item){
    if(item.quantity == 1){
      this.toastCtrl.create({
          message: 'La unidad minima es 1',
          duration: 3000,
          position: 'top'
        }).present();
        return;
    }   
    item.quantity = item.quantity - 1;
    this.updateAdditionQuantity(item);
  }
  
  addItem(item){
    item.quantity = item.quantity + 1;
    this.updateItemQuantity(item);
  }

  removeItem(item){
    if(item.quantity == 1){
      this.toastCtrl.create({
          message: 'La unidad minima es 1',
          duration: 3000,
          position: 'top'
        }).present();
        return;
    }   
    item.quantity = item.quantity - 1;
    this.updateItemQuantity(item);
  }

  deleteAdditionPrompt(item){

    let confirm = this.alertCtrl.create({
        title: 'Eliminar del carrito',
        message: '¿Seguro que deseas eliminar esta adicion del carrito?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              
            }
          },
          {
            text: 'Si',
            handler: () => {
              this.deleteAddition(item);
            }
          }
        ]
      });
      confirm.present();   

  }

  deletePrompt(item){
    let confirm = this.alertCtrl.create({
        title: 'Eliminar del carrito',
        message: '¿Seguro que deseas eliminar este producto del carrito?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              
            }
          },
          {
            text: 'Si',
            handler: () => {
              this.deleteItem(item);
            }
          }
        ]
      });
      confirm.present();   
  }

  deleteItem(item){
    this.additions = this.additions.filter(element => {
        return element.addition_of != item.id;
    });

    for (var i = 0; i < this.orderItems.length; i++) {
      var element = this.orderItems[i];
      if(element.id == item.id){
        this.orderItems.splice(i, 1);
        break;
      }
    }

    this.getTotals();

    if(this.orderItems.length == 0){
      this.back();
    } 
  }

  deleteAddition(item){
    this.additions = this.additions.filter(element => {
        return element.id != item.id;
    });    
    if(this.additions.length == 0){
      this.hasAdditions = false;
    }
    this.getTotals();
  }

  getTotals(){

    this.delivery = parseInt(this.place.delivery_cost);

    this.orderItemsTotal = 0;
    this.orderItems.forEach(element => {
      this.orderItemsTotal = this.orderItemsTotal + (parseInt(element.quantity) * parseInt(element.price));
    });

    this.additionsTotal = 0;
    this.additions.forEach(element => {
      this.additionsTotal = this.additionsTotal + (parseInt(element.quantity) * parseInt(element.price));
    });

    this.orderTotal = this.additionsTotal + this.orderItemsTotal + this.delivery;
  }

  updateAdditionQuantity(item){
    this.additions.forEach(element => {
      if(element.id == item.id){
        element.quantity = item.quantity;
      }
    }); 
    this.getTotals();
  }

  updateItemQuantity(item){
    this.orderItems.forEach(element => {
      if(element.id == item.id){
        element.quantity = item.quantity;
      }
    }); 
    this.getTotals();
  }

  deleteOrder(){
    let confirm = this.alertCtrl.create({
      title: 'Borrar todo el pedido',
      message: '¿Estas seguro de que quieres borrar todo el carrito?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            confirm.dismiss();
          }
        },
        {
          text: 'Si',
          handler: () => {
            let data = {
              deleted: true
            }
            this.viewCtrl.dismiss(data);
          }
        }
      ]
    });
    confirm.present();
  }

  initViews(){
    if(this.additions.length > 0){
      this.hasAdditions = true;
    }
    this.getTotals();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShoppingCart');
  }

  complete(){
    let data = {
      deleted: false,
      items: this.orderItems,
      additions: this.additions,
      finished: true
    }
    this.viewCtrl.dismiss(data);
  }

  back(){
    let data = {
      deleted: false,
      items: this.orderItems,
      additions: this.additions,
      finished: false
    }
    this.viewCtrl.dismiss(data);
  }

}
