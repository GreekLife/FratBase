import { Component } from '@angular/core';
import {IonicPage, Item, NavController, NavParams} from 'ionic-angular';
import {UsersService} from "../../Services/Users/Manage_Users.service";
import {Observable} from "rxjs/Observable";
import {ViewMemberPage} from "../view-member/view-member";

/**
 * Generated class for the MembersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-members',
  templateUrl: 'members.html',
})
export class MembersPage {
  userList$: Observable<Item[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private users: UsersService) {

    this.userList$ =
      this.users
        .getJonah()
        .snapshotChanges()
        .map(actions => {
          return actions.map(action => ({
            key: action.payload.key, ...action.payload.val()
          }))
        });

  }

  ViewUser(item) {
    this.navCtrl.push(ViewMemberPage, {selectedUser: item})
  }
}
