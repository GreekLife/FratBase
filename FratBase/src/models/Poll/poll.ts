import {Option} from "./PollOptions";

export class Poll {

  Epoch: string;
  Options: Option[];
  PostId: string;
  Title: string;
  UserId: string;
  Voters: string[];

  constructor(epoch: string, options: Option[], postId: string, title: string, userId: string,  voters: string[]) {

    this.Epoch = epoch;
    this.Options = options;
    this.PostId = postId;
    this.Title = title;
    this.UserId = userId;
    this.Voters = voters;
  }

}
