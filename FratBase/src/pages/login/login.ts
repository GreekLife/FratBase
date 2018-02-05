import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {HomePage} from "../home/home";
import {UsersService} from "../../Services/Manage_Users.service";
import {Tools} from "../../Services/Tools";
import {User} from "../../models/user";
import {PollsService} from "../../Services/Polls.service";
import {Poll} from "../../models/Poll/poll";
import {ForumService} from "../../Services/Forum.service";
import {AngularFireAuth} from "angularfire2/auth";

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
              public forum: ForumService, public dbAuth: AngularFireAuth) {
      this.DatabaseNode = user.getNode();
      this.UserList = this.user.GetUsersInternal();
  }

  Login() {
    if(this.username != null && this.password != null) {
      this.username = this.username.trim();
      this.password = this.password.trim();

      let exists = this.getUserByUsernameOrEmail(this.username);
      if(exists != null) {
      let pass = this.password;
        this.dbAuth.auth.signInWithEmailAndPassword(exists, pass).then( response => {
            this.poll.GetPollsInternal();
            this.forum.GetForumInternal();
            this.navCtrl.push(HomePage);
          }

        ).catch(error => {
          let errorCode = error.code;
          let errorMessage = error.message;

          console.log(errorCode);
          console.log(errorMessage);

          this.tools.presentToast("Bottom", "Your password is incorrect");

        });

      }
      else {
        this.tools.presentToast("Bottom", "No such username exists");
      }
    }
    else {
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
