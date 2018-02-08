import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
import {User} from "../models/user";
import {Tools} from "./Tools";
import {Storage} from "@ionic/storage";

@Injectable()
export class UsersService {

  private DatabaseNode: string;

  ListOfUsers: User[];
  CurrentLoggedIn: User;


  constructor(private db: AngularFireDatabase, public tools: Tools, public storage: Storage) {
    this.DatabaseNode = "Generic";
    this.GetUsersInternal();
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
        this.ListOfUsers = [];
        users = [];
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

  changeUserPositionById(userId: string, newPosition: string) {
    this.ListOfUsers.forEach(user => {
      if(user.UserId == userId) {
        user.Position = newPosition;
      }
    });
  }



}
