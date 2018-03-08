import {Component} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {Poll} from "../../../models/Poll/poll";
import {PollsService} from "../../../Services/Polls.service";
import {UsersService} from "../../../Services/Manage_Users.service";
import {User} from "../../../models/user";
import {Tools} from "../../../Services/Tools";
import {AngularFireDatabase} from "angularfire2/database";
import {ViewMemberPage} from "../../Member/view-member/view-member";
import {PollCommentsPage} from "../poll-comments/poll-comments";
import {PollVotePage} from "../poll-vote/poll-vote";
import {PollFilterPopoverPage} from "../poll-filter-popover/poll-filter-popover";

/**
 * Generated class for the PollPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-poll',
  templateUrl: 'poll.html',
})
export class PollPage {

  PollList: Poll[] = [];
  UserList: User[] = [];
  CurrentPoster: User;
  deleteClicked: string[] = [];
  filter:string = "Newest";
  deleteState = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public polls: PollsService, public user: UsersService, public tools: Tools, public db: AngularFireDatabase,
              public alertCtrl: AlertController, public modalCtrl: ModalController, public popoverCtrl: PopoverController) {
    this.PollList = polls.PollList;
    this.UserList = user.ListOfUsers;

    this.PollList.sort(function (a, b) {
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

  getGotItCount(post: Poll) {
    if(post.GotIt != null) {
      return post.GotIt.length;
    }
    else {
      return 0;
    }
  }

  getCommentCount(post: Poll) {
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

  deleteClickedContains(post: Poll){
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

  youGotIt(post: Poll) {
    if(post.GotIt == null) {
      return false;
    }
    else {
      return (post.GotIt.indexOf(this.user.CurrentLoggedIn.UserId) > -1);
    }
  }

  ViewUser(post: Poll) {
    let modal = this.modalCtrl.create(ViewMemberPage, {selectedUser: this.getUserObject(post.UserId)});
    modal.present();
  }

  viewComments(post: Poll) {
    let modal = this.modalCtrl.create(PollCommentsPage, {selectedPost: post, poster: this.getUserObject(post.UserId)}, {enableBackdropDismiss: false});
    modal.present();
  }

  goVote(post: Poll) {
    let modal = this.modalCtrl.create(PollVotePage, {selectedPost: post, poster: this.getUserObject(post.UserId)}, {enableBackdropDismiss: false});
    modal.present();
  }



  getMostVoted(post: Poll) {
    let options = post.Options;
    let mostVotedOption = options[0];
    let votesForOption = 0;
    options.forEach(option => {
      if(option.Votes != null) {
        if(option.Votes.length > votesForOption) {
          mostVotedOption = option;
          votesForOption = option.Votes.length;
        }
      }
    });

    return mostVotedOption;
  }

  getMostVotedPercent(post: Poll) {
    if(post.Voters == null) {
      return "0%";
    }
    let option = this.getMostVoted(post);
    if(option.Votes == null) {
      return "0%";
    }
    let mostVotedVotes = option.Votes.length;
    let totalVotes = 0;

    post.Options.forEach(op => {
      if(op.Votes != null) {
        totalVotes += op.Votes.length;
      }
    });

    if(totalVotes == 0 || mostVotedVotes == 0) {
      return "0%";
    }

    let percentage = (mostVotedVotes / totalVotes)  * 100;
    let percentString = (percentage|0).toString();

    return percentString + "%";
  }

  ionViewDidLoad() {

  }

  // -------------------------///
  //      Server Calls       ///
  //-------------------------///


  gotIt(post: Poll) {
    if(post.GotIt == null || post.GotIt.indexOf(this.user.CurrentLoggedIn.UserId) == -1) {
      let newGotItArray = [];
      if(post.GotIt == null) {
        newGotItArray.push(this.user.CurrentLoggedIn.UserId);
        let index = this.PollList.indexOf(post);
        if(index > -1) {
          this.PollList[index].GotIt = newGotItArray;
        }
        else {
          console.log("Error updating local got it array");
          return;
        }
      }
      else {
        newGotItArray = post.GotIt;
        newGotItArray.push(this.user.CurrentLoggedIn.UserId);
        let index = this.PollList.indexOf(post);
        if(index > -1) {
          this.PollList[index].GotIt = newGotItArray;
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
        that.polls.GetPollsInternal().then(response => {
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
        this.PollList = [];
        this.PollList = this.polls.PollList;
        this.PollList.sort(function (a, b) {
          return Number(b.Epoch) - Number(a.Epoch);
        });
      }).catch(err => {
        refresher.complete();
        console.log("error: Retrieving users terminated with error code: " + err);
        this.tools.presentToast("Bottom", "Unexpected Internal Error: Poll List");
      });
    }
    else
      this.tools.presentToast("top", "You are not connected to the internet");

  }

  deletePost(post: Poll) {
    this.deleteClicked.push(post.PostId);
    let confirm = this.alertCtrl.create({
      title: 'Delete',
      message: 'Are you sure you would like to delete this post? This cannot be undone.',
      cssClass:'buttonCss',
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            this.db.database.ref(this.user.getNode() + '/Polls/'+post.PostId).remove().then(() => {
              let index = this.PollList.indexOf(post);
              if(index > -1) {
                this.PollList.splice(index, 1);
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


  openPopover(myEvent) {
    let popover = this.popoverCtrl.create(PollFilterPopoverPage, {filterVal: this.filter});
    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(data => {
      if(data!=null){
        if(data != null) {

          this.PollList = this.polls.PollList;

          if (data == "Delete") {
            this.deleteState = true;
          }
          else {
            this.filter = data;
          }
          if(this.filter == "Newest") {
            this.PollList.sort(function (a, b) {
              return Number(b.Epoch) - Number(a.Epoch);
            });
          }
          else if(this.filter == "Oldest") {
            this.PollList.sort(function (a, b) {
              return Number(a.Epoch) - Number(b.Epoch);
            });
          }
          else if(this.filter == "Week") {
            this.PollList.sort(function (a, b) {
              return Number(b.Epoch) - Number(a.Epoch);
            });
            let weekFilteredList = [];
            this.PollList.forEach(post => {
              if(this.getDaysSince(post.Epoch) <= 7 ) {
                weekFilteredList.push(post);
              }
            });
            this.PollList = weekFilteredList;

          }
          else if(this.filter == "Month") {
            this.PollList.sort(function (a, b) {
              return Number(b.Epoch) - Number(a.Epoch);
            });
            let monthFilteredList = [];
            this.PollList.forEach(post => {
              if(this.getDaysSince(post.Epoch) <= 31 ) {
                monthFilteredList.push(post);
              }
            });
            this.PollList = monthFilteredList;

          }
        }
      }
    })
  }


}
