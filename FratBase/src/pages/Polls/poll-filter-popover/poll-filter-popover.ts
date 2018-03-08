import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {PollCreatePage} from "../poll-create/poll-create";

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,  public viewCtrl: ViewController) {
    this.selectedFilter = this.navParams.get("filterVal");
  }

  selectFilter(filter: string) {
    this.selectedFilter = filter;
    this.viewCtrl.dismiss(filter);
  }


  CreatePost() {
    let modal = this.modalCtrl.create(PollCreatePage);
    this.viewCtrl.dismiss();
    modal.present();

  }

}
