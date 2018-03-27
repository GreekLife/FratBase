import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Poll} from "../../../models/Poll/poll";
import {User} from "../../../models/user";
import {UsersService} from "../../../Services/Manage_Users.service";
import {Tools} from "../../../Services/Tools";
import {AngularFireDatabase} from "angularfire2/database";
import {ForumService} from "../../../Services/Forum.service";
import {Option} from "../../../models/Poll/PollOptions";

/**
 * Generated class for the PollEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-poll-edit',
  templateUrl: 'poll-edit.html',
})
export class PollEditPage {

  selectedPost: Poll;
  currentUser: User;
  title: string;
  options: Option[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public user: UsersService, public tools: Tools, public forum: ForumService, public db: AngularFireDatabase) {
    this.selectedPost = this.navParams.get('post');

    this.title = this.selectedPost.Title;
    this.options = this.selectedPost.Options;

    this.getUser(this.selectedPost);
  }

  cancel() {
    this.navCtrl.pop();
  }

  AddOption() {
    this.options.push(new Option('', [], ''));
  }

  RemoveOption() {
    if(this.options.length > 1) {
      this.options.pop();
    }
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

  isValid() {
    let valid = true;
    if(this.selectedPost.Title == '') {
      valid = false;
    }
    this.options.forEach(op => {
      if(op.Title == "" || op.Title == null) {
        valid = false;
      }
    });
    return valid;
  }


  //When i update the poll it changes the id to numbers rather than pushed as a unique key. Not sure if this is a problem yet

  updatePoll() {
    if(navigator.onLine) {
      this.selectedPost.Title = this.title.trim();
      this.selectedPost.Options = this.options;

      this.db.database.ref(this.user.getNode() + '/Polls/'+this.selectedPost.PostId).set(
        this.selectedPost
      ).then(() => {
        console.log("Update poll: Successful");
        this.title = "";
        this.navCtrl.pop();
      });
    }
    else
      this.tools.presentToast("top", "You are not connected to the internet");

  }

}
