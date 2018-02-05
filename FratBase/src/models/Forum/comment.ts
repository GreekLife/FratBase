export class Comment {


  CommentId: string;
  Epoch: string;
  Post: string;
  UserId: string;

  constructor(commentId: string, epoch: string, post: string, userId: string) {
    this.CommentId = commentId;
    this.Epoch = epoch;
    this.Post = post;
    this.UserId = userId;
  }

}
