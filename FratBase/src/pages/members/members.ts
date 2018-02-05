import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {UsersService} from "../../Services/Manage_Users.service";
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

    userList: object[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private users: UsersService, public modalCtrl: ModalController) {

    this.userList = this.users.ListOfUsers;

  }

  // ViewUser(item) {
  //   this.navCtrl.push(ViewMemberPage, {selectedUser: item})
  // }

  ViewUser(item) {
    let modal = this.modalCtrl.create(ViewMemberPage, {selectedUser: item});
    modal.present();
  }
}
