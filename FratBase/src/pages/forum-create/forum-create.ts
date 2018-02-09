import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UsersService} from "../../Services/Manage_Users.service";
import {User} from "../../models/user";
import {Forum} from "../../models/Forum/forum";
import {ForumService} from "../../Services/Forum.service";
import {AngularFireDatabase} from "angularfire2/database";

/**
 * Generated class for the ForumCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forum-create',
  templateUrl: 'forum-create.html',
})
export class ForumCreatePage {

  currentUser: User;
  title: string;
  body: string;


  constructor(public navCtrl: NavController, public navParams: NavParams, public user: UsersService, public forum: ForumService, public db: AngularFireDatabase) {
    this.currentUser = this.user.CurrentLoggedIn;

    this.title = "";
    this.body = "";

  }

  postConditions() {
    return (this.title != "" && this.body != "");
  }

  cancel() {
    this.navCtrl.pop();
  }

  post() {
    let epoch = new Date().getTime()/1000;
    let newPost = new Forum(epoch.toString(), null, [this.currentUser.UserId], this.body.trim(), "", this.title.trim(), this.currentUser.UserId)

    this.db.database.ref(this.user.getNode() + '/Forum').push(
      newPost
    ).then(response => {
      console.log("Post to forum: Successful");
      this.title = "";
      this.body = "";
      this.navCtrl.pop();
    });
  }

}
