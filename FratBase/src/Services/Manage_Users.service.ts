import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
import {User} from "../models/user";
@Injectable()
export class UsersService {

  private DatabaseNode: string;

  ListOfUsers: User[];

  constructor(private db: AngularFireDatabase) {
    this.DatabaseNode = "Generic";
  }

  setNode(node) {
    if(node == null) {
      this.DatabaseNode = "Generic";
    }
    else {
      node = node.replace(/\s/g, '');
      this.DatabaseNode = node;
    }
  }

  getNode() {
    return this.DatabaseNode;
  }

  GetUsersInternal() {
    let users = [];
    let idRef = this.db.database.ref(this.DatabaseNode + "/Users");
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
        this.ListOfUsers.push(userObj);
        return false;
      });
    });
    this.ListOfUsers = users;
    return users;

  }
}
