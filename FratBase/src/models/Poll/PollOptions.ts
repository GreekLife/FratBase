import {Likes} from "../Forum/likes";

export class Option {


  Title: string;
  Votes: Likes[];
  OpId: string;

  constructor(title: string, votes: Likes[], opId: string) {
    this.Title = title;
    this.Votes = votes;
    this.OpId = opId;
  }

}
