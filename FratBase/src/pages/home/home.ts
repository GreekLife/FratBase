import {Component} from '@angular/core';
import {Loading, LoadingController, NavController} from 'ionic-angular';
import {UsersService} from "../../Services/Manage_Users.service";
import {MembersPage} from "../members/members";
import {Storage} from "@ionic/storage";
import {ForumPage} from "../forum/forum";
import {User} from "../../models/user";
import {LoginPage} from "../login/login";
import {PollsService} from "../../Services/Polls.service";
import {ForumService} from "../../Services/Forum.service";
import {Tools} from "../../Services/Tools";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  CurrentUserRetrieved: User;
  loader: Loading;

  constructor(public navCtrl: NavController, private users:UsersService, public storage: Storage, public poll: PollsService, public forum: ForumService, public tools: Tools, public loadingCtrl: LoadingController) {

   let storageVal = storage.get('User').then(user => {

     this.users.CurrentLoggedIn = user;
     this.CurrentUserRetrieved = user;

     if(this.CurrentUserRetrieved == null) {
       console.log("Forced to login page");
       this.navCtrl.push(LoginPage);
       return;
     }

     let userLoader = this.loadingCtrl.create({
       content: "Please wait..."
     });

     userLoader.present().then(() => {

       let userPromise = new Promise(function (resolve, reject) {
         users.GetUsersInternal().then(response => {
           if (response == '200')
             resolve();
           else
             reject(response);
         });
       });

       userPromise.then(result => {
         userLoader.dismiss();
       }).catch(err => {
         console.log("error: Retrieving users terminated with error code: " + err);
         userLoader.dismiss();
         this.tools.presentToast("Bottom", "Unexpected Internal Error: User list");
       });
     }).catch( error=> {
       console.log("Error presenting loading wheel: " + error);
     });



      let forumLoader = this.loadingCtrl.create({
        content: "Please wait..."
      });

     forumLoader.present().then(() => {


       let forumPromise = new Promise(function (resolve, reject) {
         forum.GetForumInternal().then(response => {
           if (response == '200')
             resolve();
           else
             reject(response);
         });

       });

       forumPromise.then(result => {
         forumLoader.dismiss();
       }).catch(err => {
         console.log("error: Retrieving users terminated with error code: " + err);
         forumLoader.dismiss();
         this.tools.presentToast("Bottom", "Unexpected Internal Error: Forum List");
       });

     }).catch( error=> {
       console.log("Error presenting loading wheel: " + error);
     });

       // this.poll.GetPollsInternal();

    }).catch(error => {
      console.log("Error retrieving saved user: " + error);
      this.navCtrl.push(LoginPage);
    });

  }

  ViewMembers() {
    this.navCtrl.push(MembersPage);
  }

  ViewForum() {
    this.navCtrl.push(ForumPage);
  }

  signOut() {
    this.storage.remove('User').then(response => {
      console.log("Sign out succesful");
    }).catch(error => {
      console.log("User never existed? " + error);
    });

    this.navCtrl.push(LoginPage);
  }

}
