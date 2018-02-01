import { Component } from '@angular/core';
import {IonicPage, Item, NavController, NavParams} from 'ionic-angular';
import {Observable} from "rxjs/Observable";

/**
 * Generated class for the ViewMemberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-member',
  templateUrl: 'view-member.html',
})
export class ViewMemberPage {
  selectedUser$: Observable<Item>;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.selectedUser$ = navParams.get("selectedUser")
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewMemberPage');
  }

}
