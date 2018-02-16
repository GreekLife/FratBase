import {Likes} from "./likes";

export class Comment {


  CommentId: string;
  Epoch: string;
  Post: string;
  UserId: string;
  Likes: Likes[];

  constructor(commentId: string, epoch: string, post: string, userId: string, likes: Likes[]) {
    this.CommentId = commentId;
    this.Epoch = epoch;
    this.Post = post;
    this.UserId = userId;
    this.Likes = likes;
  }

}
