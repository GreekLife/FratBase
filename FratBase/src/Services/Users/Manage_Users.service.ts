import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
@Injectable()
export class UsersService {

  DatabaseNode = "Development";

  constructor(private db: AngularFireDatabase) {

  }

  getNode(node) {
    if(node == "Generic" || node == null) {
      this.DatabaseNode = "Development";
    }
    else {
      this.DatabaseNode = node;
    }
  }

  GetUsersInternal(node) {
    this.getNode(node);
    let users = [];
    let idRef = this.db.database.ref(this.DatabaseNode + "/Users");
    idRef.once('value', snapshot => {
      snapshot. forEach(user => {
        let userObj = {
          Username: user.child("Username").val(),
          First_Name: user.child("First Name").val(),
          Last_Name: user.child("Last Name").val(),
          Birthday: user.child("Birthday").val(),
          BrotherName: user.child("BrotherName").val(),
          Contribution: user.child("None").val(),
          Degree: user.child("Degree").val(),
          Email: user.child("Email").val(),
          Grad: user.child("GraduationDate").val(),
          ImageURL: user.child("Image").val(),
          NotificationId: user.child("NotificationId").val(),
          Position: user.child("Position").val(),
          School: user.child("School").val(),
          UserId: user.child("UserID").val()
        };
        users.push(userObj);
        return false;
      });
    });

    return users;

  }
}
