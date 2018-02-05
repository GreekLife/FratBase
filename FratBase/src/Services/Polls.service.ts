import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
import {UsersService} from "./Manage_Users.service";
import {User} from "../objects/user";

@Injectable()
export class PollsService {

  DatabaseNode: string;

  constructor(private db: AngularFireDatabase, public user: UsersService) {
    this.DatabaseNode = this.user.getNode();
  }

  GetPollsInternal() {
    let users = [];
    let idRef = this.db.database.ref(this.DatabaseNode + "/Polls");
    idRef.on('value', snapshot => {
      snapshot. forEach(user => {
        let userObj = new User(
          user.child("Username").val(),
          user.child("First Name").val(),
          user.child("Last Name").val(),
          user.child("Birthday").val(),
          user.child("BrotherName").val(),
          user.child("Contribution").val(),
          user.child("Degree").val(),
          user.child("Email").val(),
          user.child("GraduationDate").val(),
          user.child("Image").val(),
          user.child("NotificationId").val(),
          user.child("Position").val(),
          user.child("School").val(),
          user.child("UserID").val()
        );
        users.push(userObj);
        return false;
      });
    });
    this.ListOfUsers = users;
    return users;

  }
}


}
