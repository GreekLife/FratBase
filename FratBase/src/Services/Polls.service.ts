import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
import {UsersService} from "./Manage_Users.service";
import {Poll} from "../models/Poll/poll";
import {Comment} from "../models/Forum/comment";
import {Likes} from "../models/Forum/likes";
import {Option} from "../models/Poll/PollOptions"

@Injectable()
export class PollsService {

  DatabaseNode: string;

  PollList: Poll[];

  constructor(private db: AngularFireDatabase, public user: UsersService) {
  }

  GetPollsInternal() {
    this.DatabaseNode = this.user.getNode();
    let that = this;
    let pollPromise = new Promise(function(resolve, reject) {
      try {
        let idRef = that.db.database.ref(that.DatabaseNode + "/Polls");
        idRef.on('value', snapshot => {
          that.PollList = [];
          snapshot.forEach(poll => {
            let options = [];
            if(poll.child("Options") != null) {

              poll.child("Options").forEach(opt => {

                let title = opt.child("Title").val();

                let likes: Likes[] = [];
                if(opt.child("Votes") != null) {
                  opt.child("Votes").forEach(vote => {
                    let newLike = new Likes(vote.key, vote.val());
                    likes.push(newLike);
                    return false;
                  });

                }
                let votes = opt.child("Votes").val();
                let option = new Option(title, votes, opt.key);
                options.push(option);
                return false;
              });
            }
            let allComments = [];
            if (poll.child("Comments") != null) {
              poll.child("Comments").forEach(comm => {
                let likes: Likes[] = [];

                if(comm.child("Likes") != null)
                {
                  comm.child("Likes").forEach(person => {
                    let newLike = new Likes(person.key, person.val());
                    likes.push(newLike);
                    return false;
                  });
                }
                let comment = new Comment(comm.key, comm.child("Epoch").val(), comm.child("Post").val(), comm.child("UserId").val(), likes);
                allComments.push(comment);
                return false;
              });
            }
            else {
              allComments = null;
            }
            let polObj = new Poll(
              poll.child("Epoch").val(),
              options,
              poll.key,
              poll.child("Title").val(),
              poll.child("UserId").val(),
              poll.child("Voters").val(),
              poll.child("GotIt").val(),
              allComments

            );
            that.PollList.push(polObj);
            return false;
          });
        });
        resolve();
      }
      catch (exception) {
        reject();
        console.log("Error retrieving polls");
      }
    });

    return pollPromise.then(() => {
      return '200';
    }).catch(error => {
      return '400; ' + error;
    });
  }

}
