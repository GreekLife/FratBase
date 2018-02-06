import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ForumService} from "../../Services/Forum.service";
import {Forum} from "../../models/Forum/forum";
import {User} from "../../models/user";
import {UsersService} from "../../Services/Manage_Users.service";

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public forum: ForumService, public user: UsersService) {

    this.PostList = forum.ForumList;
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForumPage');
  }

}
