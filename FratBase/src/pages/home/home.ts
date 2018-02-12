import {Component} from '@angular/core';
import {Loading, NavController} from 'ionic-angular';
import {UsersService} from "../../Services/Manage_Users.service";
import {MembersPage} from "../members/members";
import {Storage} from "@ionic/storage";
import {ForumPage} from "../forum/forum";
import {User} from "../../models/user";
import {LoginPage} from "../login/login";
import {PollsService} from "../../Services/Polls.service";
import {ForumService} from "../../Services/Forum.service";
import {Tools} from "../../Services/Tools";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  CurrentUserRetrieved: User;
  loader: Loading;

  constructor(public navCtrl: NavController, private users:UsersService, public storage: Storage, public poll: PollsService, public forum: ForumService, public tools: Tools) {

    storage.get('User').then(user => {
      this.loader = this.tools.presentLoading(this.loader);

        this.users.CurrentLoggedIn = user;
        this.CurrentUserRetrieved = user;

        this.users.GetUsersInternal(this.loader);
        this.forum.GetForumInternal(this.loader);
       // this.poll.GetPollsInternal();

    }).catch(error => {
      console.log("Error retrieving saved user: " + error);
      this.navCtrl.push(LoginPage);
    });
  }

  ViewMembers() {
    this.navCtrl.push(MembersPage);
  }

  ViewForum() {
    this.navCtrl.push(ForumPage);
  }

  signOut() {
    this.storage.remove('User').catch(error => {
      console.log("User never existed? " + error);
    });

    this.navCtrl.push(LoginPage);
  }

}
