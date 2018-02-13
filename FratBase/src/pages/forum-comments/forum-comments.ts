import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, NavController, NavParams} from 'ionic-angular';
import {UsersService} from "../../Services/Manage_Users.service";
import {ForumService} from "../../Services/Forum.service";
import {User} from "../../models/user";
import {Forum} from "../../models/Forum/forum";
import {Tools} from "../../Services/Tools";
import {Comment} from "../../models/Forum/comment";
import {AngularFireDatabase} from "angularfire2/database";

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

  @ViewChild(Content) content: Content;

  CurrentPoster: User;
  Post: Forum;
  userList: User[];
  CurrentLoggedIn: User;
  Commenter: User;
  commentBody: string;
  deleteClicked: string[];
  deleteState = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public users: UsersService, public forum: ForumService, public tools: Tools, public db: AngularFireDatabase ) {
    this.commentBody = "";
    this.CurrentPoster = this.navParams.get("poster");
    this.Post = this.navParams.get("selectedPost");
    this.userList  = this.users.ListOfUsers;
    this.CurrentLoggedIn = this.users.CurrentLoggedIn;

    this.Post.Comments.sort(function (a, b) {
      return Number(a.Epoch) - Number(b.Epoch);
    });

  }

  sendMessage() {
    if(this.commentBody == "") {
      return;
    }
    let epoch = new Date().getTime()/1000;
    let newComment = new Comment("", epoch.toString(), this.commentBody, this.CurrentLoggedIn.UserId);
    this.Post.Comments.push(newComment);
    this.commentBody = "";

    this.sendCommentInternal(newComment);
  }

  sendCommentInternal(comment: Comment) {
    try {
      this.db.database.ref(this.users.getNode() + '/Forum/' + this.Post.PostId + '/Comments').push(
        comment
      ).then(response => {

      });
    }
    catch(error) {
        console.log("Error Posting comment");
    }
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

  scrollToBottom(){
    this.content.scrollToBottom(300);
  }


  removeAllClicked(){
    if(this.deleteClicked != null) {
      this.deleteClicked = [];
    }
  }

  deleteClickedContains(post: Forum){
    return (this.deleteClicked.indexOf(post.PostId) > -1);
  }

  canDelete() {
    return (this.deleteState && (this.tools.isEboard(this.users.CurrentLoggedIn.Position) || (this.CurrentPoster.UserId != this.users.CurrentLoggedIn.UserId)));
  }

}
