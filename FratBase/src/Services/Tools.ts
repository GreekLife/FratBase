import {Injectable} from "@angular/core";
import {Loading, LoadingController, ToastController} from "ionic-angular";


@Injectable()
export class Tools {

  EboardArray = ["Master", "LT Master", "Scribe", "Exchequer", "Pledge Master", "Rush Master", "Brother at Large"];

  constructor(public toastCtrl: ToastController,  public loadingCtrl: LoadingController) {

  }


  presentLoading(loader: Loading) {
     loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    loader.present().catch( error=> {
      console.log("Error presenting loading wheel: " + error);
    });
    return loader;
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

  isEboard(position: string) {
    return (this.EboardArray.indexOf(position) > -1);
  }

}
