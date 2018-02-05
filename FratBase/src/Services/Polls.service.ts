import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
import {UsersService} from "./Manage_Users.service";
import {Poll} from "../models/Poll/poll";

@Injectable()
export class PollsService {

  DatabaseNode: string;

  PollList: Poll[];

  constructor(private db: AngularFireDatabase, public user: UsersService) {
    this.DatabaseNode = this.user.getNode();
  }

  GetPollsInternal() {
   let polls = [];
    let idRef = this.db.database.ref(this.DatabaseNode + "/Polls");
    idRef.on('value', snapshot => {
      snapshot. forEach(poll => {
        let options = [];
        let optionIndex = poll.child("Options").val();
        optionIndex.forEach(op => {
          let option = new Option(op["Title"], op["Votes"]);
          console.log(op.Title);
        });

        let polObj = new Poll(
            poll.child("Epoch").val(),
            options,
            poll.child("PostId").val(),
            poll.child("Title").val(),
            poll.child("UserId").val(),
            poll.child("Voters").val()
        );
        polls.push(polObj);

        return false;
      });
    });
    this.PollList = polls;

    return polls;

  }

}
