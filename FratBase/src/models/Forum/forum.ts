export class Forum {

  Comments: Comment[];
  Epoch: string;
  GotIt: string[];
  Post: string;
  PostId: string;
  PostTitle: string;
  UserId: string;

  constructor(epoch: string, comments: Comment[], gotIt: string[], post: string, postId: string, postTitle: string, userId: string) {
    this.Comments = comments;
    this.Epoch = epoch;
    this.GotIt = gotIt;
    this.Post = post;
    this.PostId = postId;
    this.PostTitle = postTitle;
    this.UserId = userId;
  }

}
