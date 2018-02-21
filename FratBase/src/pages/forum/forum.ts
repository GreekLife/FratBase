import {ChangeDetectorRef, Component} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {ForumService} from "../../Services/Forum.service";
import {Forum} from "../../models/Forum/forum";
import {User} from "../../models/user";
import {UsersService} from "../../Services/Manage_Users.service";
import {FilterPopoverPage} from "../filter-popover/filter-popover";
import {AngularFireDatabase} from "angularfire2/database";
import {Tools} from "../../Services/Tools";
import {ForumCommentsPage} from "../forum-comments/forum-comments";
import {ViewMemberPage} from "../view-member/view-member";

/**
 * Generated class for the ForumPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forum',
  templateUrl: 'forum.html',
})
export class ForumPage {

  PostList: Forum[] = [];
  UserList: User[];
  CurrentPoster: User;
  filter:string = "Newest";
  deleteState = false;
  deleteClicked: string[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, private cdr: ChangeDetectorRef, public alertCtrl: AlertController, public forum: ForumService, public user: UsersService, public popoverCtrl: PopoverController, private db: AngularFireDatabase, public tools: Tools) {
    this.PostList = forum.ForumList;
    this.UserList = user.ListOfUsers;

      this.PostList.sort(function (a, b) {
        return Number(b.Epoch) - Number(a.Epoch);
      });

      this.CurrentPoster = null;
  }

  // -------------------------///
  //        Tools             ///
  //-------------------------///
  getUserObject(userId: string) {
    this.UserList.forEach(user => {
      if(user.UserId == userId) {
        this.CurrentPoster = user;
      }
    });
    if(this.CurrentPoster == null) {
      return "User Doesn't Exist";
    }
    return this.CurrentPoster;
  }

  getGotItCount(post: Forum) {
    if(post.GotIt != null) {
      return post.GotIt.length;
    }
    else {
      return 0;
    }
  }

  getCommentCount(post: Forum) {
    if(post.Comments != null) {
      return post.Comments.length;
    }
    else {
      return 0;
    }
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
    return (this.deleteState && (this.tools.isEboard(this.user.CurrentLoggedIn.Position) || (this.CurrentPoster.UserId != this.user.CurrentLoggedIn.UserId)));
  }

  getTimeSince(epoch: string) {
    return this.tools.getTimeSince(epoch);
  }

  getDaysSince(epoch: string) {
   return this.tools.getDaysSince(epoch);

  }

  youGotIt(post: Forum) {
    if(post.GotIt == null) {
      return false;
    }
    else {
      return (post.GotIt.indexOf(this.user.CurrentLoggedIn.UserId) > -1);
    }
  }

  // -------------------------///
  //      Server Calls       ///
  //-------------------------///

  deletePost(post: Forum) {
    this.deleteClicked.push(post.PostId);
    let confirm = this.alertCtrl.create({
      title: 'Delete',
      message: 'Are you sure you would like to delete this post? This cannot be undone.',
      cssClass:'buttonCss',
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            this.db.database.ref(this.user.getNode() + '/Forum/'+post.PostId).remove().then(response => {
              let index = this.PostList.indexOf(post);
              if(index > -1) {
                this.PostList.splice(index, 1);
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

  gotIt(post: Forum) {
    if(post.GotIt == null || post.GotIt.indexOf(this.user.CurrentLoggedIn.UserId) == -1) {
      let newGotItArray = [];
        if(post.GotIt == null) {
        newGotItArray.push(this.user.CurrentLoggedIn.UserId);
        let index = this.PostList.indexOf(post);
        if(index > -1) {
          this.PostList[index].GotIt = newGotItArray;
        }
        else {
          console.log("Error updating local got it array");
          return;
        }
      }
      else {
        newGotItArray = post.GotIt;
        newGotItArray.push(this.user.CurrentLoggedIn.UserId);
        let index = this.PostList.indexOf(post);
        if(index > -1) {
          this.PostList[index].GotIt = newGotItArray;
        }
        else {
          console.log("Error updating local got it array");
          return;
        }
      }

      this.db.database.ref(this.user.getNode() + '/Forum/' + post.PostId + "/GotIt").set(
        newGotItArray
      ).then(response => {
        console.log("Got It: Successful");

      }).catch(error => {
        console.log("Error with Got It button");
        this.tools.presentToast("Bottom", "There was an unexplained error handling your request");
      });
    }
    else {
      let alert = this.alertCtrl.create();
      alert.setTitle('Got It');
      let username = "";
      post.GotIt.forEach( user => {
        this.UserList.forEach(userObj =>{
          if(userObj.UserId == user) {
            username = userObj.First_Name + " " + userObj.Last_Name;
          }
        });
        alert.addInput({
          type: 'radio',
          label: username,
          value: username,
          checked : false,
          disabled: true
        });
      });
      alert.addButton('Close');
      alert.present().then(() => {
      });
    }

  }
  timeOut = null;
  refresh(refresher) {
    let that = this;
    this.timeOut = setTimeout(function() {
      that.refreshInternal(refresher);
    }, 500);
  }

  refreshInternal(refresher) {
    clearTimeout(this.timeOut);
    if(navigator.onLine) {
      let that = this;
      let forumPromise = new Promise(function (resolve, reject) {
        that.forum.GetForumInternal().then(response => {
          if (response == '200') {
            resolve();
          }
          else {
            reject(response);
          }
        });

      });

      forumPromise.then(result => {
        refresher.complete();
        this.PostList = [];
        this.PostList = this.forum.ForumList;
        this.PostList.sort(function (a, b) {
          return Number(b.Epoch) - Number(a.Epoch);
        });
      }).catch(err => {
        refresher.complete();
        console.log("error: Retrieving users terminated with error code: " + err);
        this.tools.presentToast("Bottom", "Unexpected Internal Error: Forum List");
      });
    }
     else
      this.tools.presentToast("top", "You are not connected to the internet");

}


  // -------------------------///
  //         Segues          ///
  //-------------------------///

  ViewUser(post: Forum) {
    let modal = this.modalCtrl.create(ViewMemberPage, {selectedUser: this.getUserObject(post.UserId)});
    modal.present();
  }

  viewComments(post: Forum) {
    let modal = this.modalCtrl.create(ForumCommentsPage, {selectedPost: post, poster: this.getUserObject(post.UserId)}, {enableBackdropDismiss: false});
    modal.present();
  }

  openPopover(myEvent) {
    let popover = this.popoverCtrl.create(FilterPopoverPage, {filterVal: this.filter});
    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(data => {
      if(data!=null){
        if(data != null) {

          this.PostList = this.forum.ForumList;

          if (data == "Delete") {
            this.deleteState = true;
          }
          else {
            this.filter = data;
          }
          if(this.filter == "Newest") {
            this.PostList.sort(function (a, b) {
              return Number(b.Epoch) - Number(a.Epoch);
            });
          }
          else if(this.filter == "Oldest") {
            this.PostList.sort(function (a, b) {
              return Number(a.Epoch) - Number(b.Epoch);
            });
          }
          else if(this.filter == "Week") {
            this.PostList.sort(function (a, b) {
              return Number(b.Epoch) - Number(a.Epoch);
            });
              let weekFilteredList = [];
            this.PostList.forEach(post => {
              if(this.getDaysSince(post.Epoch) <= 7 ) {
                weekFilteredList.push(post);
              }
            });
              this.PostList = weekFilteredList;

          }
          else if(this.filter == "Month") {
            this.PostList.sort(function (a, b) {
              return Number(b.Epoch) - Number(a.Epoch);
            });
            let monthFilteredList = [];
            this.PostList.forEach(post => {
              if(this.getDaysSince(post.Epoch) <= 31 ) {
                monthFilteredList.push(post);
              }
            });
            this.PostList = monthFilteredList;

          }
        }
      }
    })
  }

}
