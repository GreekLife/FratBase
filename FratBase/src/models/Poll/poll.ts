import {Option} from "./PollOptions";
import {Comment} from "../Forum/comment";

export class Poll {

  Epoch: string;
  Options: Option[];
  PostId: string;
  Title: string;
  UserId: string;
  Voters: string[];
  Comments: Comment[];
  GotIt: string[];
  OneVote: boolean;

  constructor(epoch: string, options: Option[], postId: string, title: string, userId: string,  voters: string[], gotIt: string[], comment: Comment[], oneVote: boolean) {

    this.Epoch = epoch;
    this.Options = options;
    this.PostId = postId;
    this.Title = title;
    this.UserId = userId;
    this.Voters = voters;
    this.Comments = comment;
    this.GotIt = gotIt;
    this.OneVote = oneVote;
  }

}
