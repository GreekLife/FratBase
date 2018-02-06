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
    let posts = [];
    let idRef = this.db.database.ref(this.DatabaseNode + "/Forum");
    idRef.on('value', snapshot => {
      this.ForumList = [];
      snapshot. forEach(poll => {
        let comments = poll.child("Comments");
        let allComments = [];
        comments.forEach(comm => {
          let comment = new Comment(comm["CommentId"], comm["Epoch"], comm["Post"], comm["UserId"]);
          allComments.push(comment);
          return false;
        });

        let forumObj = new Forum(
          poll.child("Epoch").val(),
          allComments,
          poll.child("GotIt").val(),
          poll.child("Post").val(),
          poll.child("PostId").val(),
          poll.child("PostTitle").val(),
          poll.child("UserId").val()
        );
        posts.push(forumObj);

        return false;
      });
      this.ForumList = posts;

    });
    this.ForumList = posts;

    return posts;

  }

}
