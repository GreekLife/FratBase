import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {HomePage} from "../home/home";
import {UsersService} from "../../Services/Manage_Users.service";
import {Tools} from "../../Services/Tools";
import {User} from "../../models/user";
import {PollsService} from "../../Services/Polls.service";
import {ForumService} from "../../Services/Forum.service";
import {AngularFireAuth} from "angularfire2/auth";
import {Storage} from "@ionic/storage";

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

  UserList: User[];

  username: string;
  password: string;


  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public user: UsersService, public tools: Tools, public poll: PollsService,
              public forum: ForumService, public dbAuth: AngularFireAuth, private storage: Storage) {
      this.DatabaseNode = user.getNode();
      this.UserList = this.user.GetUsersInternal();

    storage.get('Username').then((user) => {
       this.username = user;
      storage.get('Password').then((pass) => {
         this.password = pass;
         this.tools.presentLoading();
         this.authenticate(this.username, this.password);
      });
    });
  }

  Login() {
    this.tools.presentLoading();
    if(this.username != null && this.password != null) {
      this.username = this.username.trim();
      this.password = this.password.trim();

      let exists = this.getUserByUsernameOrEmail(this.username);
      if(exists != null) {
      let pass = this.password;
        this.authenticate(exists, pass);
      }
      else {
        this.tools.dismissLoading();
        this.tools.presentToast("Bottom", "No such username exists");
      }
    }
    else {
      this.tools.dismissLoading();
      this.tools.presentToast("Bottom", "No field can be left empty");
    }
  }

  getUserByUsernameOrEmail(username: string) {
    let exists = null;

    this.UserList.forEach(user => {
      if(user.Username == username || user.Email == username) {
        exists = user.Email;
      }
    });
    return exists;
  }

  authenticate(exists, pass) {
    this.dbAuth.auth.signInWithEmailAndPassword(exists, pass).then( response => {
        this.storage.set('Username', exists);
        this.storage.set('Password', pass);
        this.poll.GetPollsInternal();
        this.forum.GetForumInternal();
        this.tools.dismissLoading();
        this.navCtrl.push(HomePage);
      }

    ).catch(error => {
      let errorCode = error.code;
      let errorMessage = error.message;

      console.log(errorCode);
      console.log(errorMessage);
      this.tools.dismissLoading();

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
