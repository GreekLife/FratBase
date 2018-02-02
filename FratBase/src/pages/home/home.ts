import {Component} from '@angular/core';
import {Item, NavController} from 'ionic-angular';
import {UsersService} from "../../Services/Users/Manage_Users.service";
import {Observable} from "rxjs/Observable";
import {MembersPage} from "../members/members";
import {LoginPage} from "../login/login";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private users:UsersService) {

  }

  ViewMembers() {
    this.navCtrl.push(MembersPage);
  }

  Signout() {
    this.navCtrl.push(LoginPage);
  }

}
