import { Component } from '@angular/core';
import {AlertController, IonicPage, Item, NavController, NavParams} from 'ionic-angular';
import {Observable} from "rxjs/Observable";
import {User} from "../../models/user";
import {UsersService} from "../../Services/Manage_Users.service";
import {AngularFireDatabase} from "angularfire2/database";
import {Tools} from "../../Services/Tools";

/**
 * Generated class for the ViewMemberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-member',
  templateUrl: 'view-member.html',
})
export class ViewMemberPage {

  selectedUser: User;
  Position: string;

  hasChanged = false;

  CurrentUser: User;

  OptionsOpen: boolean;

  UserList: User[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public user: UsersService, public firebase: AngularFireDatabase, public tools: Tools) {
    this.OptionsOpen = false;
    this.selectedUser = this.navParams.get("selectedUser");
    this.Position = this.selectedUser.Position;
    this.CurrentUser = this.user.CurrentLoggedIn;
    this.UserList = user.ListOfUsers;


  }

  cancel(){
    this.navCtrl.pop();
  }

  save() {
    this.firebase.database.ref(this.user.getNode() + '/Users/' + this.selectedUser.UserId + "/Position").set(
      this.Position
    ).then(response => {
      this.user.changeUserPositionById(this.selectedUser.UserId, this.Position);
      this.tools.presentToast("top", "The users data has been updated.");
      this.hasChanged = false;
    }).catch(error => {
      console.log(error);
      this.tools.presentToast("bottom", "There was an issue processing your request");
    });

  }

  selectPosition() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Position');

    //---Theoretically this shouldn't be hardcoded ----//
    alert.addInput({
      type: 'radio',
      label: 'Brother',
      value: 'Brother',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: 'Alumni',
      value: 'Alumni',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Pledge',
      value: 'Pledge',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'LT Master',
      value: 'LT Master',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Scribe',
      value: 'Scribe',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Exchequer',
      value: 'Exchequer',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Pledge Master',
      value: 'Pledge Master',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Rush Master',
      value: 'Rush Master',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Brother at Large',
      value: 'Brother at Large',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Alumni',
      value: 'Alumni',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Alumni',
      value: 'Alumni',
      checked: false
    });
    //------------------------------------------------//

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        if(this.Position != data) {
          console.log("Position has changed");
          this.hasChanged = true;
        }
        this.Position = data;
      }
    });
    alert.present().then(() => {
      this.OptionsOpen = true;
    });
  }


}
