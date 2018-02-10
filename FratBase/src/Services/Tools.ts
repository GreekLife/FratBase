import {Injectable} from "@angular/core";
import {Loading, LoadingController, NavController, ToastController} from "ionic-angular";
import {UsersService} from "./Manage_Users.service";
import {User} from "../models/user";
import {ViewMemberPage} from "../pages/view-member/view-member";


@Injectable()
export class Tools {

  EboardArray = ["Master", "LT Master", "Scribe", "Exchequer", "Pledge Master", "Rush Master", "Brother at Large"];

  constructor(public toastCtrl: ToastController,  public loadingCtrl: LoadingController) {

  }

  //analyzes a text a returns the test but with all URLs and Emails reformated to links

  urlify(postBody: string, users: User[]) {
    // http://, https://, ftp://
    let urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

    // www. sans http:// or https://
    let pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

    //tag people
    let tagPattern = /(\s@\S+)/gi;

    // Email addresses
    let emailAddressPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gim;

    return postBody
      .replace(urlPattern, '<a href="$&">$&</a>')
      .replace(pseudoUrlPattern, '$1<a href="http://$2">$2</a>')
      .replace(emailAddressPattern, '<a href="mailto:$&">$&</a>')
      .replace(tagPattern, "<a href='#' >$1</a>");
  }

  findUser(name, users: User[], nav: NavController) {
   name = name.substr(1, name.length());
  users.forEach( user => {
  let fullname = user.First_Name+user.Last_Name;
  if(user.BrotherName == name || fullname == name) {
     // nav.push(ViewMemberPage, {selectedUser: user});
}
});

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
