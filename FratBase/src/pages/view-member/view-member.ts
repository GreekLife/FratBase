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
  selectedUser: object;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.selectedUser = this.navParams.get("selectedUser");

  }

  cancel(){
    this.navCtrl.pop();
  }

}
