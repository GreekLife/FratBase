import {Component} from '@angular/core';
import {Item, NavController} from 'ionic-angular';
import {UsersService} from "../../Services/Users/Manage_Users.service";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  userList$: Observable<Item[]>;
  selectedUser$: Observable<Item> = null;
  viewProfile = false;
  constructor(public navCtrl: NavController, private users:UsersService) {
  this.selectedUser$ = null;

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

  dismiss() {
    this.selectedUser$ = null;
    this.viewProfile = false;
    document.getElementById("MemberList").style.display = 'block';
    document.getElementById("MemberSelected").style.display = 'none';
  }

  ViewUser(item) {
    this.selectedUser$ = item;
    this.viewProfile = true;
    document.getElementById("MemberList").style.display = 'none';
    document.getElementById("MemberSelected").style.display = 'block';
  }

}
