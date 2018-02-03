import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {HomePage} from "../home/home";

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



  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.DatabaseNode = "Generic";
  }

  Login() {
    this.navCtrl.push(HomePage);
  }

  showNodes() {
    let alert = this.alertCtrl.create();
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
      }
    });
    alert.present().then(() => {
      this.OptionsOpen = true;
    });
  }

}
