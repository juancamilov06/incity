import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

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

  option: string = "info";
  menu: string = "entry";
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
                , public http: Http, public storage: Storage) {
        this.restaurantName = this.navParams.get('restaurantName');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Place');
    this.getProfile(this.navParams.get('restaurantId'));
  }

  open(){
    this.menuCtrl.open();
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

  getProfile(restaurantId: number){
    console.log(restaurantId);
    let loader = this.loading.create({content: "Espera un momento"});
    loader.present();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.storage.ready().then(() => {
      this.storage.get('token').then((token) => {
        this.http.get('https://incitybackend.000webhostapp.com/restaurant/'+ restaurantId+'/profile?token=' + token, headers)
        .map(res => res.json())
        .subscribe(data => {
          loader.dismiss();
          this.comments = data.data.comments;
          this.completeMenu = data.data.menu;
          this.place = data.data.place;
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
