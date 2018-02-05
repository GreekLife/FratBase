import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {HomePage} from "../home/home";
import {UsersService} from "../../Services/Manage_Users.service";
import {Tools} from "../../Services/Tools";
import {User} from "../../objects/user";

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



  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public user: UsersService, public tools: Tools) {
    if(user.getNode() == "Development") {
      this.DatabaseNode = "Generic";
    }
    else {
      this.DatabaseNode = user.getNode();
    }
  }

  Login() {
    if(this.username != null || this.password != null) {
      this.username = this.username.trim();
      this.password = this.password.trim();

      this.UserList = this.user.GetUsersInternal();
      this.navCtrl.push(HomePage);
    }
    else {
      this.tools.presentToast("Bottom", "No field can be left empty");
      this.UserList = this.user.GetUsersInternal();
      this.navCtrl.push(HomePage);
    }
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
