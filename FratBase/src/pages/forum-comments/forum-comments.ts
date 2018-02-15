import {Component, ViewChild} from '@angular/core';
import {AlertController, Content, IonicPage, NavController, NavParams} from 'ionic-angular';
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
  deleteClicked: string[] = [];
  deleteState = false;
  refreshCommentTimeout: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public users: UsersService, public alertCtrl: AlertController, public forum: ForumService, public tools: Tools,
              public db: AngularFireDatabase) {
    this.commentBody = "";
    this.CurrentPoster = this.navParams.get("poster");
    this.Post = this.navParams.get("selectedPost");

    this.userList  = this.users.ListOfUsers;
    this.CurrentLoggedIn = this.users.CurrentLoggedIn;

    this.Post.Comments.sort(function (a, b) {
      return Number(a.Epoch) - Number(b.Epoch);
    });

    this.refreshCommentTimeout = setInterval(() => {
      this.refreshComments();
    }, 10000);

  }

  refreshComments() {
    console.log("Refreshed comments");
    try {
      let index = this.forum.ForumList.map(function (e) {
        return e.PostId;
      }).indexOf(this.Post.PostId);
      if (index > -1) {
        this.Post.Comments = this.forum.ForumList[index].Comments;
      }
    }
    catch(error) {
      console.log("Unexpected Internal Error: refreshing comments");
    }
  }


  sendMessage() {

    //this.connection.onlineCheck().then(() => {
    if(navigator.onLine) {
      if (this.commentBody == "") {
        return;
      }
      let epoch = new Date().getTime() / 1000;
      let newComment = new Comment("", epoch.toString(), this.commentBody, this.CurrentLoggedIn.UserId);
      this.Post.Comments.push(newComment);
      this.commentBody = "";

      this.sendCommentInternal(newComment);
    }
      else
        this.tools.presentToast("top", "You are not connected to the internet");
  }

  sendCommentInternal(comment: Comment) {
    try {
      this.db.database.ref(this.users.getNode() + '/Forum/' + this.Post.PostId + '/Comments').push(
        comment
      ).then(() => {
        this.scrollToBottom();
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
    return this.Commenter;
  }

  cancel(){
    clearInterval(this.refreshCommentTimeout);
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

  deleteClickedContains(comment: Comment){
    return (this.deleteClicked.indexOf(comment.CommentId) > -1);
  }

  canDelete() {
    return (this.deleteState && (this.tools.isEboard(this.users.CurrentLoggedIn.Position) || (this.CurrentPoster.UserId != this.users.CurrentLoggedIn.UserId)));
  }

  setDeleteState() {
    this.deleteState = !this.deleteState;
    this.deleteClicked = [];
  }

  deletePost(comment: Comment) {
    if(navigator.onLine) {
        this.deleteClicked.push(comment.CommentId);
      let confirm = this.alertCtrl.create({
        title: 'Delete',
        message: 'Are you sure you would like to delete this comment? This cannot be undone.',
        cssClass:'buttonCss',
        buttons: [
          {
            text: 'Delete',
            handler: () => {
              this.db.database.ref(this.users.getNode() + '/Forum/'+this.Post.PostId + "/Comments/"+comment.CommentId).remove().then(response => {
                let index = this.Post.Comments.indexOf(comment);
                if(index > -1) {
                  this.Post.Comments.splice(index, 1);
                }
              }).catch(error => {
                this.tools.presentToast("Bottom", "An unexpected error occurred while trying to handle your request");
                console.log("Error");
              });
            }
          },
          {
            text: 'Cancel',
            handler: () => {
              this.removeAllClicked();
            }
          }
        ]
      });
      confirm.present();
  }
  else
    this.tools.presentToast("top", "You are not connected to the internet");
  }

}
