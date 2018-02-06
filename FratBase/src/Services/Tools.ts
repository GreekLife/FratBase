import {Injectable} from "@angular/core";
import {Loading, LoadingController, ToastController} from "ionic-angular";


@Injectable()
export class Tools {

  loader: Loading;

  constructor(public toastCtrl: ToastController,  public loadingCtrl: LoadingController) {

  }


  presentLoading() {
     this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    this.loader.present();
  }

  dismissLoading() {
    this.loader.dismiss().catch(error=> {
      console.log("All good: loader error");
    });
  }

  presentToast(position: string, message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: position
    });
    toast.present().catch(error=> {
      console.log("All good: loader error");
    });
  }

}
