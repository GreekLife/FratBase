import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {UsersService} from "../../../Services/Manage_Users.service";
import {ViewMemberPage} from "../view-member/view-member";
import {Tools} from "../../../Services/Tools";
import {User} from "../../../models/user";


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

    userList: User[];

    isEboard = false;

    EmailList = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private users: UsersService, public modalCtrl: ModalController, public tools: Tools) {

    this.userList = this.users.ListOfUsers;

    this.isEboard = tools.isEboard(users.CurrentLoggedIn.Position);

  }

  EmailAll() {

    this.userList.forEach(user => {
      this.EmailList.push(user.Email);
    });

    let email = this.EmailList.toString();
    let subject = "Message from your eboard";
    let body = "Hey Boys, \n\n\n\n Most fraternily, \n The Eboard";
    location.href = 'mailto:' + email
      + '?subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(body);

  }

  ViewUser(item) {
    let modal = this.modalCtrl.create(ViewMemberPage, {selectedUser: item});
    modal.present();
  }
}
