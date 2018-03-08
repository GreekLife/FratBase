import {Component} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {User} from "../../../models/user";
import {Poll} from "../../../models/Poll/poll";
import {UsersService} from "../../../Services/Manage_Users.service";
import {Tools} from "../../../Services/Tools";
import {Option} from "../../../models/Poll/PollOptions";
import {PollsService} from "../../../Services/Polls.service";
import {ViewMemberPage} from "../../Member/view-member/view-member";
import {Likes} from "../../../models/Forum/likes";
import {AngularFireDatabase} from "angularfire2/database";

/**
 * Generated class for the PollVotePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-poll-vote',
  templateUrl: 'poll-vote.html',
})
export class PollVotePage {

  CurrentPoster: User;
  Post: Poll;
  userList: User[];
  CurrentLoggedIn: User;
  toggleValue: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public  users: UsersService, public tools: Tools, public polls: PollsService, public modalCtrl: ModalController,
              public db: AngularFireDatabase, public alertCtrl: AlertController) {
    this.userList = users.ListOfUsers;
    this.CurrentLoggedIn = users.CurrentLoggedIn;
    this.CurrentPoster = this.navParams.get("poster");
    this.Post = this.navParams.get("selectedPost");
  }

  getPercent(option: Option) {

    if(this.Post.Voters == null || option.Votes == null) {
      return "0%";
    }

    let numberOfVoters = option.Votes.length;
    let totalVotes = 0;

    this.Post.Options.forEach(op => {
      if(op.Votes != null) {
        totalVotes += op.Votes.length;
      }
    });

    if(totalVotes == 0) {
      return "0%";
    }
    else {
      let percentage = (numberOfVoters / totalVotes)  * 100;
      let percentString = (percentage|0).toString();

      return percentString + "%";
    }
  }

  cancel(){
    this.navCtrl.pop();
  }

  youVotedForIt(option: Option) {
    try {
      let index = option.Votes.map(function (e) {
        return e.UserId;
      }).indexOf(this.CurrentLoggedIn.UserId);
      return (index > -1);
    }
    catch(error) {
      console.log(error);
      console.log("Unexpected Internal Error: you liked it comments");
      return false;
    }
  }

  updateToggle($event) {

    if (this.toggleValue) {
      this.Post.Options.sort(function (a, b) {
        return Number(b.Votes.length) - Number(a.Votes.length);
      });
    }
  }

  getUserObject(userId: string) {
    let userObj = null;
    this.userList.forEach(user => {
      if(user.UserId == userId) {
        userObj = user;
      }
    });
    return userObj;
  }

  ViewUser(user: User) {
    let modal = this.modalCtrl.create(ViewMemberPage, {selectedUser: user});
    modal.present();
  }

  ViewVoters(option: Option) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Votes');
    let username = "";
    option.Votes.forEach( vote => {
      this.userList.forEach(userObj =>{
        if(userObj.UserId == vote.UserId) {
          username = userObj.First_Name + " " + userObj.Last_Name;
        }
      });
      alert.addInput({
        type: 'radio',
        label: username,
        value: username,
        checked : false,
        disabled: true
      });
    });
    alert.addButton('Close');
    alert.present().then(() => {
    });
  }

  voteForOption(option: Option) {
    if(!this.youVotedForIt(option)) {
        let index = this.Post.Options.indexOf(option);
        if(index > -1) {
          this.Post.Options[index].Votes.push(new Likes(this.Post.Options[index].Votes.length.toString(), this.CurrentLoggedIn.UserId));
          let voteArray = [];
          this.Post.Options[index].Votes.forEach(vote => {
            voteArray.push(vote.UserId);
          });

          this.db.database.ref(this.users.getNode() + '/Polls/' + this.Post.PostId + "/Options/" + option.OpId + "/Votes").set(
            voteArray
          ).then(() => {
            console.log("Vote: Successful");
          }).catch(error => {
            console.log("Vote: Unsuccessful: " + error);
            this.tools.presentToast("bottom", "Unexpected Internal Server Error");
          });

          if(this.Post.Voters == null || this.Post.Voters.indexOf(this.CurrentLoggedIn.UserId) < 0) {
            if(this.Post.Voters == null) {
              let array = [this.CurrentLoggedIn.UserId];
              this.Post.Voters = array;
            }
          else
            this.Post.Voters.push(this.CurrentLoggedIn.UserId);


            this.db.database.ref(this.users.getNode() + '/Polls/' + this.Post.PostId + "/Voters").set(
              this.Post.Voters
            ).then(() => {
              console.log("Voters: Successful");
            }).catch(error => {
              console.log("Voters: Unsuccessful: " + error);
              this.tools.presentToast("bottom", "Unexpected Internal Server Error");
            });
          }
        }
    }
    else {
      let index = this.Post.Options.indexOf(option);
      if(index > -1) {
        let indexVote = this.Post.Options[index].Votes.map(function (e) {
          return e.UserId;
        }).indexOf(this.CurrentLoggedIn.UserId);
        if(indexVote > -1) {
          this.Post.Options[index].Votes.splice(indexVote, 1);
          let voteArray = [];
          this.Post.Options[index].Votes.forEach(vote => {
            voteArray.push(vote.UserId);
          });
          this.db.database.ref(this.users.getNode() + '/Polls/' + this.Post.PostId + "/Options/" + option.OpId + "/Votes").set(
            voteArray
          ).then(() => {
            console.log("Vote: Successful");
          }).catch(error => {
            console.log("Vote: Unsuccessful: " + error);
            this.tools.presentToast("bottom", "Unexpected Internal Server Error");
          });

          let stillExists = false;
          this.Post.Options.forEach(opt => {
            if(this.youVotedForIt(opt)) {
              stillExists = true;
            }
          });

          if(!stillExists) {
            let voterIndex = this.Post.Voters.indexOf(this.CurrentLoggedIn.UserId);
            if(voterIndex > -1) {
              this.Post.Voters.splice(voterIndex, 1);

              this.db.database.ref(this.users.getNode() + '/Polls/' + this.Post.PostId + "/Voters").set(
                this.Post.Voters
              ).then(() => {
                console.log("Voters: Successful");
              }).catch(error => {
                console.log("Voters: Unsuccessful: " + error);
                this.tools.presentToast("bottom", "Unexpected Internal Server Error");
              });
            }
          }


        }
      }
    }


  }
}
