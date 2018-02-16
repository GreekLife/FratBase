import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
import {UsersService} from "./Manage_Users.service";
import {Forum} from "../models/Forum/forum";
import {Comment} from "../models/Forum/comment";
import {Likes} from "../models/Forum/likes";

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
          snapshot.forEach(forum => {
            let allComments = [];
            if (forum.child("Comments") != null) {
              forum.child("Comments").forEach(comm => {
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

            let forumObj = new Forum(
              forum.child("Epoch").val(),
              allComments,
              forum.child("GotIt").val(),
              forum.child("Post").val(),
              forum.key,
              forum.child("PostTitle").val(),
              forum.child("UserId").val()
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
