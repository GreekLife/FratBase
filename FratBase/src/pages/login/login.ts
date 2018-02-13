import {Component} from '@angular/core';
import {AlertController, IonicPage, Loading, NavController, NavParams} from 'ionic-angular';
import {HomePage} from "../home/home";
import {UsersService} from "../../Services/Manage_Users.service";
import {Tools} from "../../Services/Tools";
import {User} from "../../models/user";
import {PollsService} from "../../Services/Polls.service";
import {ForumService} from "../../Services/Forum.service";
import {AngularFireAuth} from "angularfire2/auth";
import {Storage} from "@ionic/storage";
import {AngularFireDatabase} from "angularfire2/database";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  DatabaseNode: string;
  OptionsOpen: boolean;

  UserList: User[] = [];
  username: string;
  password: string;

  loader: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public user: UsersService, public tools: Tools, public poll: PollsService,
              public forum: ForumService, public dbAuth: AngularFireAuth, private storage: Storage, public db: AngularFireDatabase) {
      this.DatabaseNode = user.getNode();

    let userLoader = this.tools.presentLoading(this.loader);

    let userPromise = new Promise(function(resolve, reject) {
      user.GetUsersInternal().then(response => {
        if(response == '200')
          resolve();
        else
          reject(response);
      });
    });

    userPromise.then(result=> {
      this.UserList = user.ListOfUsers;
      userLoader.dismiss();
    }).catch( err => {
      console.log("error: Retrieving users terminated with error code: " + err);
      userLoader.dismiss();
      this.tools.presentToast("Bottom", "Unexpected Internal Error: User list login");
    });
  }

  Login() {
    this.loader = this.tools.presentLoading(this.loader);
    if(this.username != null && this.password != null) {
      this.password = this.password.trim();

      let exists = this.getUserByUsernameOrEmail(this.username.trim());
      if(exists != null) {
      let pass = this.password;
        this.authenticate(exists, pass);
      }
      else {
        this.loader.dismiss().catch(error=> {
          console.log("Error dismissing loader: " + error);
        });
        this.tools.presentToast("Bottom", "No such username exists");
      }
    }
    else {
      this.loader.dismiss().catch(error=> {
        console.log("Error dismissing loader: " + error);
      });
      this.tools.presentToast("Bottom", "No field can be left empty");
    }
  }

  getUserByUsernameOrEmail(username: string) {
    let exists = null;

    this.UserList.forEach(user => {
      if(user.Username == username || user.Email == username) {
        exists = user.Email;
        this.user.CurrentLoggedIn = user;
      }
    });
    return exists;
  }

  authenticate(exists, pass) {
    this.dbAuth.auth.signInWithEmailAndPassword(exists, pass).then( response => {
        this.storage.set('User', this.user.CurrentLoggedIn);
        this.loader.dismiss().catch(error=> {
          console.log("Error dismissing loader: " + error);
        });
        this.navCtrl.push(HomePage);

      }
    ).catch(error => {
      let errorCode = error.code;
      let errorMessage = error.message;

      console.log(errorCode);
      console.log(errorMessage);
      this.loader.dismiss().catch(error=> {
        console.log("Error dismissing loader: " + error);
      });
      this.tools.presentToast("Bottom", "Your password is incorrect");

    });

  }

  showNodes() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Chapter');

    //---Theoretically this shouldn't be hardcoded ----//
    alert.addInput({
      type: 'radio',
      label: 'Generic',
      value: 'Generic',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: 'Gamma Lambda',
      value: 'Gamma Lambda',
      checked: false
    });
    //------------------------------------------------//

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.OptionsOpen = false;
        this.DatabaseNode = data;
        this.user.setNode(data);
      }
    });
    alert.present().then(() => {
      this.OptionsOpen = true;
    });
  }

}
