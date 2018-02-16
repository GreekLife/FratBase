export class Likes {

    LikeId: string;
    UserId: string;

    constructor(likeId: string, userId: string) {
      this.LikeId = likeId;
      this.UserId = userId;
    }
}
