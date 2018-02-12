import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UsersService} from "../../Services/Manage_Users.service";
import {ForumService} from "../../Services/Forum.service";
import {User} from "../../models/user";
import {Forum} from "../../models/Forum/forum";
import {Tools} from "../../Services/Tools";
import {Comment} from "../../models/Forum/comment";

/**
 * Generated class for the ForumCommentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forum-comments',
  templateUrl: 'forum-comments.html',
})
export class ForumCommentsPage {

  CurrentPoster: User;
  Post: Forum;
  userList: User[];
  CurrentLoggedIn: User;
  Commenter: User;
  commentBody: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public users: UsersService, public forum: ForumService, public tools: Tools ) {
    this.commentBody = "";
    this.CurrentPoster = this.navParams.get("poster");
    this.Post = this.navParams.get("selectedPost");
    this.userList  = this.users.ListOfUsers;
    this.CurrentLoggedIn = this.users.CurrentLoggedIn;

  }

  sendMessage() {
    let epoch = new Date().getTime()/1000;
    let newComment = new Comment("", epoch.toString(), this.commentBody, this.CurrentLoggedIn.UserId);
    this.Post.Comments.push(newComment);
    this.commentBody = "";

    this.sendMessageInternal()
  }

  sendMessageInternal() {

  }

  getUserObject(userId: string) {
    this.userList.forEach(user => {
      if(user.UserId == userId) {
        this.Commenter = user;
      }
    });
    return this.CurrentPoster;
  }

  cancel(){
    this.navCtrl.pop();
  }

}
