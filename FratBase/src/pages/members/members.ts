import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {UsersService} from "../../Services/Users/Manage_Users.service";
import {ViewMemberPage} from "../view-member/view-member";
import {LoginPage} from '../login/login';


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

    userList: object[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private users: UsersService) {

    //this.userList = this.users.GetUsersInternal(node.DatabaseNode);

  }

  ViewUser(item) {
    this.navCtrl.push(ViewMemberPage, {selectedUser: item})
  }
}
