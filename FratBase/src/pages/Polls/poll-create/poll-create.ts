import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AngularFireDatabase} from "angularfire2/database";
import {User} from "../../../models/user";
import {UsersService} from "../../../Services/Manage_Users.service";
import {Tools} from "../../../Services/Tools";
import {PollsService} from "../../../Services/Polls.service";
import {Option} from "../../../models/Poll/PollOptions";
import {Poll} from "../../../models/Poll/poll";

/**
 * Generated class for the PollCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-poll-create',
  templateUrl: 'poll-create.html',
})
export class PollCreatePage {

  currentUser: User;
  title: string;
  body: string;
  Options = [{value: ''}, {value: ''}];


  constructor(public navCtrl: NavController, public navParams: NavParams, public user: UsersService, public tools: Tools, public polls: PollsService, public db: AngularFireDatabase, public loadingCtrl: LoadingController) {
    this.currentUser = this.user.CurrentLoggedIn;

    this.title = "";
    this.body = "";

  }


  cancel() {
    this.navCtrl.pop();
  }

  AddOption() {
    this.Options.push({value: ''});
  }

  RemoveOption() {
    if(this.Options.length > 1) {
      this.Options.pop();
    }
  }

  updateToggle($event) {

  }

  post() {
    let isValid = true;
    if(this.Options.length < 2) {
      this.tools.presentToast("bottom", "You must have at least two options");
      isValid = false;
    }
    this.Options.forEach(op => {
      if(op.value == "") {
        this.tools.presentToast("bottom", "No options can be left empty");
        isValid = false;
      }
    });

    if(isValid){
      let that = this;
      let optionList = [];
      this.Options.forEach(option => {
        optionList.push(new Option(option.value,[],""))
      });


      let pollUpload = this.loadingCtrl.create({
        content: "Please wait..."
      });

      pollUpload.present().then(() => {
        let pollPromise = new Promise(function (resolve, reject) {
          let epoch = new Date().getTime() / 1000;
          let newPoll = new Poll(epoch.toString(), optionList, "", that.title, that.user.CurrentLoggedIn.UserId, [], [that.user.CurrentLoggedIn.UserId], [] );
      //push to array
          that.polls.CreatePoll(newPoll).then(response => {
            if (response == '200')
              resolve();
            else
              reject(response);
          });
        });

        pollPromise.then(() => {
          pollUpload.dismiss();
          that.navCtrl.pop();
        }).catch(err => {
          console.log("error: uploading poll terminated with error code: " + err);
          pollUpload.dismiss();
          that.tools.presentToast("Bottom", "Unexpected Internal Error: Uploading Poll");
        });
      }).catch( error=> {
        console.log("Error presenting loading wheel: " + error);
      });


    }
  }
}
