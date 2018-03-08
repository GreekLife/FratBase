import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {ForumCreatePage} from "../forum-create/forum-create";

/**
 * Generated class for the FilterPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-filter-popover',
  templateUrl: 'filter-popover.html',
})
export class FilterPopoverPage {

  selectedFilter = "Newest";

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,  public viewCtrl: ViewController) {
      this.selectedFilter = this.navParams.get("filterVal");
  }

  selectFilter(filter: string) {
    this.selectedFilter = filter;
    this.viewCtrl.dismiss(filter);
  }


  CreatePost() {
    let modal = this.modalCtrl.create(ForumCreatePage);
    this.viewCtrl.dismiss();
    modal.present();

  }

}
