import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController
                  , LoadingController, ModalController, ToastController
                  , PopoverController, AlertController, App } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AddCommentModal } from '../add-comment/add-comment';
import { AddItemPage } from '../add-item/add-item';
import { ShoppingCartPage } from '../shopping-cart/shopping-cart';
import { StartPage } from '../start/start';
import { CONFIG } from '../../providers/constants.js';

/**
 * Generated class for the Place page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-place',
  templateUrl: 'place.html',
})
export class PlacePage {

  place: any = {
    delivery_cost:'',
    hours:'',
    img_url:'',
    minimum_order:''
  };

  orderItems: Array<any> = new Array();
  additions: Array<any> = new Array();

  orderTotal: number = 0;

  restaurantId: number;
  currentTotal: number = 0;

  option: string = "menu";
  menu: string = "entry";
  comment: string = "";
  restaurantName: string;
  completeMenu: Array<any>;

  comments: Array<any>;
  entries: Array<any>;
  desserts: Array<any>;
  mainCourses: Array<any>;
  iceCream: Array<any>;
  beverages: Array<any>;
  liqueurs: Array<any>;

  emptyEntries: boolean = false;
  emptyDesserts: boolean = false;
  emptyMainCourses: boolean = false;
  emptyLiqueurs: boolean = false;
  emptyBeverages: boolean = false;
  emptyComments: boolean = false


  constructor(public navCtrl: NavController, public navParams: NavParams
                , public menuCtrl: MenuController, public loading: LoadingController
                , public http: Http, public storage: Storage, public modalCtrl: ModalController
                , public toastCtrl: ToastController, public popoverCtrl: PopoverController
                , public alertCtrl: AlertController, public app: App) {
        this.restaurantName = this.navParams.get('restaurantName');
        this.restaurantId = this.navParams.get('restaurantId');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Place');
    this.getProfile(this.navParams.get('restaurantId'));
  }

  back(){
    if(this.orderItems.length > 0){
      let confirm = this.alertCtrl.create({
        title: 'Salir',
        message: '¿Tienes productos en el carrito, quieres continuar?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              
            }
          },
          {
            text: 'Si',
            handler: () => {
              this.navCtrl.pop();
            }
          }
        ]
      });
      confirm.present();
    }

    this.navCtrl.pop();
  }

  open(){
    this.menuCtrl.open();
  }

  openModal(){
    let modal = this.modalCtrl.create(AddCommentModal);
    modal.onDidDismiss((data) => {
      if(data){     
        data.restaurant_id = this.restaurantId;
        this.sendMessage(data);
      }
    });
    modal.present();
  }

  deleteOrder(){
    let confirm = this.alertCtrl.create({
      title: 'Borrar todo el pedido',
      message: '¿Estas seguro de que quieres borrar todo el carrito?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            
          }
        },
        {
          text: 'Si',
          handler: () => {
            this.orderItems = new Array();
            this.additions = new Array();
            this.orderTotal = 0;
            let toast = this.toastCtrl.create({
              message: 'Pedido eliminado con exito',
              duration: 3000,
              position: 'top'
            });
            toast.present();
          }
        }
      ]
    });
    confirm.present();
  }

  openShoppingCart(){
    if(this.orderItems.length == 0){
      let toast = this.toastCtrl.create({
         message: 'Primero debes añadir productos al carrito',
         duration: 3000,
         position: 'top'
      });
      toast.present();
      return;
    }

    let popover = this.modalCtrl.create(ShoppingCartPage, {
      order_items: this.orderItems,
      additions: this.additions,
      place: this.place
    });

    popover.onDidDismiss((data) => {
      if(data.finished){
        this.app.getRootNav().setRoot(StartPage, {
          fromCreation: true
        });
      }
      if(data.deleted){
        this.orderItems = new Array();
        this.additions = new Array();
        this.toastCtrl.create({
          message: 'Pedido borrado con exito',
          duration: 3000,
          position: 'top'
        }).present();
      } else {
        this.orderItems = data.items;
        this.additions = data.additions;
      }
    })
    popover.present();
  }

  openAddItem(item){

    let popover = this.modalCtrl.create(AddItemPage, {
      item: item,
      place_id: this.place.id,
      additions: this.additions
    });

    popover.onDidDismiss((orderItem, additionsItem) => {
      if(orderItem != null && additionsItem != null){
        this.additions = additionsItem.additions;
        var item = orderItem.item;
        if(!this.isAddedInList(item)){
          this.orderItems.push(item);
        }
        this.toastCtrl.create({
          message: 'Producto añadido exitosamente',
          duration: 3000,
          position: 'top'
        }).present();
      }        
    });
    popover.present();
  }

  isAddedInList(item){
    var added = false;
    this.orderItems.forEach(element => {
      if(item.id == element.id){
        added = true;
      }
    });
    return added;
  }

  updateTotal(){
    this.orderTotal = 0;
    this.orderItems.forEach(element => {
      this.orderTotal = this.orderTotal + (element.total * element.quantity);
    });
    this.additions.forEach(element => {
      this.orderTotal = this.orderTotal + element.total;
    })
  }

  setListsUp(){

    if(this.comments.length == 0){
      this.emptyComments = true;
    }

    this.entries = this.completeMenu.filter((course) => {
      return course.type_id == 1
    });
    if(this.entries.length == 0){
      this.emptyEntries = true;
    }

    this.mainCourses = this.completeMenu.filter((course) => {
      return course.type_id == 2
    });
    if(this.mainCourses.length == 0){
      this.emptyMainCourses = true;
    }

    this.beverages = this.completeMenu.filter((course) => {
      return course.type_id == 3
    });
    if(this.beverages.length == 0){
      this.emptyBeverages = true;
    }

    this.desserts = this.completeMenu.filter((course) => {
      return course.type_id == 4
    });
    if(this.desserts.length == 0){
      this.emptyDesserts = true;
    }

    this.liqueurs = this.completeMenu.filter((course) => {
      return course.type_id == 5
    });
    if(this.liqueurs.length == 0){
      this.emptyLiqueurs = true;
    }
  }

  sendMessage(data: any){

    let loader = this.loading.create({content: "Espera un momento"});
    loader.present();

    let body = new FormData();
    body.append('data', JSON.stringify(data));

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.storage.ready().then(() => {
      this.storage.get('token').then((token) => {
        console.log(token);
        this.http.post('http://' + CONFIG.host +'/incity/api/comment/create?token=' + token, body, headers)
        .map(res => res.json())
        .subscribe(data => {
          loader.dismiss();
          if(data.success == true){
            this.getProfile(this.restaurantId);
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
        });
      });
    });    
  }

  getProfile(restaurantId: number){
    console.log(restaurantId);
    let loader = this.loading.create({content: "Espera un momento"});
    loader.present();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.storage.ready().then(() => {
      this.storage.get('token').then((token) => {
        this.http.get('http://' + CONFIG.host +'/incity/api/place/'+ restaurantId+'/profile?token=' + token, headers)
        .map(res => res.json())
        .subscribe(data => {
          loader.dismiss();
          if(data.data.comments){
            this.comments = data.data.comments;
          }
          if(data.data.menu){
            this.completeMenu = data.data.menu;
          }
          if(data.data.place){
            this.place = data.data.place;
          } 
          console.log(this.place);
          this.setListsUp();
        }, error => {
          loader.dismiss();
          console.log(error);
        });
      });
    });
  }

}
