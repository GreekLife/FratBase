import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
import {UsersService} from "./Manage_Users.service";
import {Forum} from "../models/Forum/forum";
import {Comment} from "../models/Forum/comment";

@Injectable()
export class ForumService {

  DatabaseNode: string;

  ForumList: Forum[];

  isFetching = false;


  constructor(private db: AngularFireDatabase, public user: UsersService) {
    this.DatabaseNode = this.user.getNode();
  }

  GetForumInternal() {
    let posts = [];
    this.isFetching = true;
    let idRef = this.db.database.ref(this.DatabaseNode + "/Forum");
    idRef.on('value', snapshot => {
      this.ForumList = [];
      posts = [];
      snapshot. forEach(poll => {
        let comments = poll.child("Comments");
        let allComments = [];
        if(comments != null) {
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
        posts.push(forumObj);

        return false;
      });
      this.ForumList = posts;

    });
    this.isFetching = false;
    this.ForumList = posts;
    return posts;

  }

}
