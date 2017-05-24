import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides,MenuController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { CONFIG } from '../../providers/constants.js';
import { PlacePage } from '../place/place';

/**
 * Generated class for the Places page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-places',
  templateUrl: 'places.html',
})
export class PlacesPage {
  @ViewChild(Slides) slides: Slides;

  option: string = '';
  rate: number = 0;
  loadedRestaurants: Array<any>;
  restaurants: Array<any>;
  search: string = '';
  customTemplate: string = '';

  mySlideOptions = {
    pager:true
  };

  constructor(public navCtrl: NavController, public navParams: NavParams
        , public loading: LoadingController, public storage: Storage
        , public http: Http, public menu: MenuController) {
      this.option = this.navParams.get('option');          
  }

  initializeItems(){
    this.restaurants = []
    Array.prototype.push.apply(this.restaurants, this.loadedRestaurants);
    console.log('reloaded');
  }

  itemClicked(restaurant){
    this.navCtrl.push(PlacePage, {
      restaurantId:restaurant.id,
      restaurantName: restaurant.name
    })
  }

  onCancel(ev){
    this.initializeItems();
  }

  getItems(ev) {
    this.initializeItems();
    var val = ev.target.value;

    if (val && val.trim() != '') {
      this.restaurants = this.restaurants.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    console.log(this.restaurants.length);
  }

  back(){
    this.navCtrl.pop();
  }  

  getRestaurants(){
    let loader = this.loading.create({content: "Espera un momento"});
    loader.present();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.storage.ready().then(() => {
      this.storage.get('token').then((token) => {
        this.storage.get('city_id').then((cityId) => {
          this.http.get('http://' + CONFIG.host +'/incity/api/city/'+ cityId +'/places?token=' + token, headers)
          .map(res => res.json())
          .subscribe(data => {
            loader.dismiss();
            this.loadedRestaurants = data.data;
            this.initializeItems();
            console.log(this.loadedRestaurants);
          }, error => {
            loader.dismiss();
            console.log(error);
          });
        });
      });
    });
  }

  open(){
    this.menu.open();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Places');
    this.slides.startAutoplay();
    this.getRestaurants();
  }

}
