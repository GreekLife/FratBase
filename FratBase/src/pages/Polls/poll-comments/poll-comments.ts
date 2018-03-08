import {Component, ViewChild} from '@angular/core';
import {AlertController, Content, IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFireDatabase} from "angularfire2/database";
import {UsersService} from "../../../Services/Manage_Users.service";
import {Tools} from "../../../Services/Tools";
import {User} from "../../../models/user";
import {Poll} from "../../../models/Poll/poll";
import {Comment} from "../../../models/Forum/comment";
import {Likes} from "../../../models/Forum/likes";
import {PollsService} from "../../../Services/Polls.service";

/**
 * Generated class for the PollCommentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-poll-comments',
  templateUrl: 'poll-comments.html',
})
export class PollCommentsPage {

  @ViewChild(Content) content: Content;

  CurrentPoster: User;
  Post: Poll;
  userList: User[];
  CurrentLoggedIn: User;
  Commenter: User;
  commentBody: string;
  deleteClicked: string[] = [];
  deleteState = false;
  refreshCommentTimeout: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public users: UsersService, public alertCtrl: AlertController, public poll: PollsService, public tools: Tools,
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
    try {
      let index = this.poll.PollList.map(function (e) {
        return e.PostId;
      }).indexOf(this.Post.PostId);
      if (index > -1) {
        this.Post.Comments = this.poll.PollList[index].Comments;
      }
    }
    catch(error) {
      console.log("Unexpected Internal Error: refreshing comments");
    }
  }


  sendMessage() {
    if(navigator.onLine) {
      if (this.commentBody == "") {
        return;
      }
      let epoch = new Date().getTime() / 1000;
      let newComment = new Comment("", epoch.toString(), this.commentBody, this.CurrentLoggedIn.UserId, null);
      this.Post.Comments.push(newComment);
      this.commentBody = "";

      this.sendCommentInternal(newComment);
    }
    else
      this.tools.presentToast("top", "You are not connected to the internet");
  }

  sendCommentInternal(comment: Comment) {
    try {
      this.db.database.ref(this.users.getNode() + '/Polls/' + this.Post.PostId + '/Comments').push(
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
    if(this.CurrentPoster == null) {
      return "User Doesn't Exist";
    }
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
              this.db.database.ref(this.users.getNode() + '/Polls/'+this.Post.PostId + "/Comments/"+comment.CommentId).remove().then(response => {
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

  likeIt(comment: Comment) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Likes');
    let username = "";
    comment.Likes.forEach( user => {
      this.users.ListOfUsers.forEach(userObj =>{
        if(userObj.UserId == user.UserId) {
          username = userObj.First_Name + " " + userObj.Last_Name;
        }
      });
      let disabled = true;
      let checked = false;
      if(username == this.CurrentLoggedIn.First_Name+" "+this.CurrentLoggedIn.Last_Name) {
        disabled = false;
        checked = true;
      }
      alert.addInput({
        type: 'radio',
        label: username,
        value: username,
        checked : checked,
        disabled: disabled
      });
    });
    alert.present().then(() => {
      if(comment.Likes == null || comment.Likes.map(e => {return e.UserId;}).indexOf(this.CurrentLoggedIn.UserId) < 0) {
        alert.addButton({
          text: 'Like',
          cssClass: 'Like',
          handler: () => {
            this.LikePost(comment);
          }
        });
        alert.addButton({text: 'Close'});
      }
      else {
        alert.addButton({text: 'Close'});
        alert.addButton({
          text: 'Unlike',
          cssClass: 'Unlike',
          handler: () => {
            this.UnlikePost(comment);
          }
        });
      }
    });
  }

  UnlikePost(comment: Comment) {
    if(comment.Likes != null && comment.Likes.map(e => {return e.UserId;}).indexOf(this.CurrentLoggedIn.UserId) > -1) {
      let index = this.Post.Comments.indexOf(comment);
      let likeIndex = comment.Likes.map(e => {return e.UserId;}).indexOf(this.CurrentLoggedIn.UserId);
      let like = comment.Likes[likeIndex];
      if(index > -1) {
        this.Post.Comments[index].Likes.splice(likeIndex, 1);
      }
      else {
        console.log("Error updating local Likes array");
        return;
      }

      this.db.database.ref(this.users.getNode() + '/Polls/' + this.Post.PostId + "/Comments/" + comment.CommentId + "/Likes/"+like.LikeId).remove()
        .then(response => {
          console.log("Remove Like: Successful");
        }).catch(error => {
        console.log("Error handling unlike request: " + error);
        this.tools.presentToast("bottom", "Unexpected Internal Server Error");
      });
    }
  }

  LikePost(comment: Comment) {
    if(comment.Likes == null || comment.Likes.map(e => {return e.UserId;}).indexOf(this.CurrentLoggedIn.UserId) < 0) {
      if(comment.Likes == null) {
        let newLikeArray = [];
        newLikeArray.push(this.CurrentLoggedIn.UserId);
        let index = this.Post.Comments.indexOf(comment);
        if(index > -1) {
          this.Post.Comments[index].Likes = newLikeArray;
        }
        else {
          console.log("Error updating local Likes array");
          return;
        }
      }
      else {
        let index = this.Post.Comments.indexOf(comment);
        if(index > -1) {
          this.Post.Comments[index].Likes.push(new Likes("temp", this.CurrentLoggedIn.UserId));
        }
        else {
          console.log("Error updating local Likes array");
          return;
        }
      }

      this.db.database.ref(this.users.getNode() + '/Polls/' + this.Post.PostId + "/Comments/" + comment.CommentId + "/Likes").push(
        this.CurrentLoggedIn.UserId
      ).then(response => {
        console.log("Like It: Successful");

      });
    }
  }

  getLikedItCount(comment: Comment){
    if(comment.Likes != null) {
      return comment.Likes.length;
    }
    else
      return 0;
  }

  youLikedIt(comment: Comment) {
    if(comment.Likes == null) {
      return false;
    }
    try {
      let index = comment.Likes.map(function (e) {
        return e.UserId;
      }).indexOf(this.CurrentLoggedIn.UserId);
      return (index > -1);
    }
    catch(error) {
      console.log(error);
      console.log("Unexpected Internal Error: you liked it comments");
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PollCommentsPage');
  }

}
