import {Injectable} from "@angular/core";
import {LoadingController, ToastController} from "ionic-angular";


@Injectable()
export class Tools {

  constructor(public toastCtrl: ToastController,  public loadingCtrl: LoadingController) {

  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    loader.present();
  }

  presentToast(position: string, message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: position
    });
    toast.present();
  }

}
