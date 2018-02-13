import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
import {UsersService} from "./Manage_Users.service";
import {Forum} from "../models/Forum/forum";
import {Comment} from "../models/Forum/comment";

@Injectable()
export class ForumService {

  DatabaseNode: string;

  ForumList: Forum[];



  constructor(private db: AngularFireDatabase, public user: UsersService) {
    this.DatabaseNode = this.user.getNode();
  }

  GetForumInternal() {
    let that = this;
    let forumPromise = new Promise(function(resolve, reject) {
      try {
        let idRef = that.db.database.ref(that.DatabaseNode + "/Forum");
        idRef.on('value', snapshot => {
          that.ForumList = [];
          snapshot.forEach(poll => {
            let comments = poll.child("Comments");
            let allComments = [];
            if (comments != null) {
              comments.forEach(comm => {
                let comment = new Comment(comm.child("CommentId").val(), comm.child("Epoch").val(), comm.child("Post").val(), comm.child("UserId").val());
                allComments.push(comment);
                return false;
              });
            }
            else {
              allComments = null;
            }

            let forumObj = new Forum(
              poll.child("Epoch").val(),
              allComments,
              poll.child("GotIt").val(),
              poll.child("Post").val(),
              poll.key,
              poll.child("PostTitle").val(),
              poll.child("UserId").val()
            );
            that.ForumList.push(forumObj);

            return false;
          });
          resolve();
        });
      }
      catch(error) {
        reject();
      }
    });
    return forumPromise.then(response => {
      return '200';
    }).catch(error => {
      return '400; ' + error;
    });
  }

}
