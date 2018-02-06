import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {UsersService} from "../../Services/Manage_Users.service";
import {MembersPage} from "../members/members";
import {Storage} from "@ionic/storage";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private users:UsersService, public storage: Storage) {
  }

  ViewMembers() {
    this.navCtrl.push(MembersPage);
  }

  signOut() {

    this.storage.remove('Password');
    this.storage.remove('User');

    this.navCtrl.pop();
  }

}
