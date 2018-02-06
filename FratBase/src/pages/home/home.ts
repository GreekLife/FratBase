import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {UsersService} from "../../Services/Manage_Users.service";
import {MembersPage} from "../members/members";
import {Storage} from "@ionic/storage";
import {ForumPage} from "../forum/forum";

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

  ViewForum() {
    this.navCtrl.push(ForumPage);
  }

  signOut() {
    this.storage.remove('Username');
    this.storage.remove('Password');

    this.navCtrl.pop();
  }

}
