import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HomePage} from "../home/home";
import {UsersService} from "../../Services/Users/Manage_Users.service";

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

  DatabaseNode: String;
  OptionsOpen: boolean;

  UserList: object[];

  username: String;
  password: String;



  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public user: UsersService, public loadingCtrl: LoadingController) {
    if(user.getNode() == "Development") {
      this.DatabaseNode = "Generic";
    }
    else {
      this.DatabaseNode = user.getNode();
    }

    this.UserList = this.user.GetUsersInternal();
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    loader.present();
  }

  Login() {
    this.navCtrl.push(HomePage);
  }

  showNodes() {
    let alert = this.alertCtrl.create();
    alert.setCssClass('alertStyle');
    alert.setTitle('Chapter');

    alert.addInput({
      type: 'radio',
      label: 'Generic',
      value: 'Development',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: 'Gamma Lambda',
      value: 'GammaLambda',
      checked: false
    });

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
