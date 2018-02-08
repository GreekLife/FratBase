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
      this.UserList = this.user.ListOfUsers;

    this.loader = this.tools.presentLoading(this.loader);

    let idRef = this.db.database.ref(this.DatabaseNode + "/Users");
    idRef.once('value', snapshot => {
      let users = [];
      snapshot. forEach(user => {
        let userObj = new User(
          user.child("Username").val(),
          user.child("First Name").val(),
          user.child("Last Name").val(),
          user.child("Birthday").val(),
          user.child("BrotherName").val(),
          user.child("Contribution").val(),
          user.child("Degree").val(),
          user.child("Email").val(),
          user.child("GraduationDate").val(),
          user.child("Image").val(),
          user.child("NotificationId").val(),
          user.child("Position").val(),
          user.child("School").val(),
          user.child("UserID").val()
        );
        users.push(userObj);
        return false;
      });
      this.user.ListOfUsers = users;
      this.UserList = users;
      this.loader.dismiss().catch(error=> {
        console.log("Error dismissing loader: " + error);
      });

      storage.get('Username').then((user) => {
        this.username = user;
        storage.get('Password').then((pass) => {
          this.password = pass;

          if(this.password != null && this.username != null) {
            this.Login();
          }

        });
      });
    }).catch(error=> {
      this.loader.dismiss().catch(error=> {
        console.log("Error dismissing loader: " + error);
      });
      console.log("could not fetch users");
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
        this.storage.set('Username', exists);
        this.storage.set('Password', pass);

        this.poll.GetPollsInternal();
        this.forum.GetForumInternal();
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
