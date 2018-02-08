import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import {ForumService} from "../../Services/Forum.service";
import {Forum} from "../../models/Forum/forum";
import {User} from "../../models/user";
import {UsersService} from "../../Services/Manage_Users.service";
import {FilterPopoverPage} from "../filter-popover/filter-popover";
import {AngularFireDatabase} from "angularfire2/database";
import {Tools} from "../../Services/Tools";

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

  PostList: Forum[];
  CurrentPoster: User;
  filter:string = "Newest";
  deleteState = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public forum: ForumService, public user: UsersService, public popoverCtrl: PopoverController, private db: AngularFireDatabase, public tools: Tools) {
    this.PostList = forum.ForumList;

      this.PostList.sort(function (a, b) {
        return Number(b.Epoch) - Number(a.Epoch);
      });

      this.CurrentPoster = null;
  }

  getUserObject(userId: string) {
    this.user.ListOfUsers.forEach(user => {
      if(user.UserId == userId) {
        this.CurrentPoster = user;
      }
    });
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

  gotIt(post: Forum) {
    if(post.GotIt == null || post.GotIt.indexOf(this.user.CurrentLoggedIn.UserId) == -1) {
      let newGotItArray = [];
        if(post.GotIt == null) {
          console.log(1);
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

        document.getElementById("GotItIcon").style.color = "#FFDF00";

      });
    }
    else {
      let alert = this.alertCtrl.create();
      alert.setTitle('Got It');
      let username = "";
      post.GotIt.forEach( user => {
        this.user.ListOfUsers.forEach(userObj =>{
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

  getTimeSince(epoch: string) {
    let date = new Date();
    let currentEpoch = date.getTime()/ 1000;
    let timeSince = currentEpoch - Number(epoch);

    let minutes = Math.floor(timeSince / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    let time = days + "d";
    if(days < 1) {
      time = hours + "h";
      if(hours < 1) {
        time = minutes + "m";
      if(minutes < 1) {
        time = timeSince + "s";
      }
      }
    }
    return time;
  }

  refresh() {
    this.forum.isFetching = true;
    this.forum.GetForumInternal();
  }

  getDaysSince(epoch: string) {
    let date = new Date();
    let currentEpoch = date.getTime()/ 1000;
    let timeSince = currentEpoch - Number(epoch);

    let minutes = Math.floor(timeSince / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    return days;

  }

  openPopover(myEvent) {
    let popover = this.popoverCtrl.create(FilterPopoverPage, {filterVal: this.filter});
    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(data => {
      console.log(data);
      if(data!=null){
        let selectedData = data;
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
              if(this.getDaysSince(post.Epoch) <= 8 ) {
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
