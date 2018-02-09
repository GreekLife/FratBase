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

  getTimeSince(epoch: string) {
    let date = new Date();
    let currentEpoch = date.getTime()/ 1000;
    let timeSince = currentEpoch - Number(epoch);

    let minutes = Math.floor(timeSince / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    let time = days + "d";
    if(days < 1) {
      time = hours + "h";
      if(hours < 1) {
        time = minutes + "m";
        if(minutes < 1) {
          time = 0 + "m";
        }
      }
    }
    return time;
  }

  getDaysSince(epoch: string) {
    let date = new Date();
    let currentEpoch = date.getTime()/ 1000;
    let timeSince = currentEpoch - Number(epoch);

    let minutes = Math.floor(timeSince / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    return days;

  }

  isEboard(position: string) {
    return (this.EboardArray.indexOf(position) > -1);
  }

}
