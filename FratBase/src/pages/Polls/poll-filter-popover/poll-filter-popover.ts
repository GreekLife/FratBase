import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {PollCreatePage} from "../poll-create/poll-create";
import {ForumCreatePage} from "../../Forums/forum-create/forum-create";

/**
 * Generated class for the PollFilterPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-poll-filter-popover',
  templateUrl: 'poll-filter-popover.html',
})
export class PollFilterPopoverPage {

  selectedFilter = "Newest";
  mineIsActive = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,  public viewCtrl: ViewController) {
    this.selectedFilter = this.navParams.get("filterVal");
    this.mineIsActive = this.navParams.get('mineIsActive');
    console.log(this.mineIsActive);
  }

  selectFilter(filter: string) {
    this.selectedFilter = filter;
    this.viewCtrl.dismiss(filter);
  }



  itemClicked(item: string) {
    switch(item) {
      case 'Newest':
        this.selectFilter(item);
        break;
      case 'Oldest':
        this.selectFilter(item);
        break;
      case 'Week':
        this.selectFilter(item);
        break;
      case 'Month':
        this.selectFilter(item);
        break;
      case 'Delete':
        this.selectFilter(item);
        break;
      case 'Create':
        let modal = this.modalCtrl.create(ForumCreatePage);
        this.viewCtrl.dismiss();
        modal.present();
        break;
      case 'Mine':
        this.mineIsActive = !this.mineIsActive;
        this.viewCtrl.dismiss(item);
        break;
    }
  }


}
