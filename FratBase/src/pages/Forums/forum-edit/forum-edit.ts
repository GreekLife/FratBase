import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ForumService} from "../../../Services/Forum.service";
import {User} from "../../../models/user";
import {Tools} from "../../../Services/Tools";
import {UsersService} from "../../../Services/Manage_Users.service";
import {AngularFireDatabase} from "angularfire2/database";
import {Forum} from "../../../models/Forum/forum";

/**
 * Generated class for the ForumEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forum-edit',
  templateUrl: 'forum-edit.html',
})
export class ForumEditPage {

  title: string;
  body: string;
  selectedPost: Forum;
  currentUser: User;


  constructor(public navCtrl: NavController, public navParams: NavParams, public user: UsersService, public tools: Tools, public forum: ForumService, public db: AngularFireDatabase) {
      this.selectedPost = this.navParams.get('post');

      this.title = this.selectedPost.PostTitle;
      this.body = this.selectedPost.Post;

      this.getUser(this.selectedPost);

  }

  getUserObjectFromId(userId: string) {
    let userFound = null;
    this.user.ListOfUsers.forEach(user => {
      if(user.UserId == userId) {
        userFound = user;
      }
    });
    return userFound;
  }

  getUser(post) {
    let user = this.getUserObjectFromId(post.UserId);
    if(user == null) {
      //handle this error
      this.cancel();
    }
    else {
      this.currentUser = user;
    }
  }


  cancel() {
    this.navCtrl.pop();
  }

  post() {
    if(navigator.onLine) {
      this.selectedPost.Post = this.body.trim();
      this.selectedPost.PostTitle = this.title.trim();

      this.db.database.ref(this.user.getNode() + '/Forum/'+this.selectedPost.PostId).set(
        this.selectedPost
      ).then(response => {
        console.log("Update forum: Successful");
        this.title = "";
        this.body = "";
        this.navCtrl.pop();
      });
    }
    else
      this.tools.presentToast("top", "You are not connected to the internet");

  }
}
