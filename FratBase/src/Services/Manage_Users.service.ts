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
    this.DatabaseNode = "";
  }

  setNode(node) {
    if(node == null) {
      this.DatabaseNode = "";
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
    let that = this;
    let userPromise = new Promise(function(resolve, reject) {
      try {
        let idRef = that.db.database.ref(that.DatabaseNode + "/Users");
        idRef.on('value', snapshot => {
          that.ListOfUsers = [];
          snapshot.forEach(user => {
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
            that.ListOfUsers.push(userObj);
            return false;
          });
          resolve('200');
        });
      }
      catch (error) {
        reject();
      }
    });
   return userPromise.then(response => {
      return '200';
    }).catch(error => {
      return '400; ' + error;
    });
  }

  changeUserPositionById(userId: string, newPosition: string) {
    this.ListOfUsers.forEach(user => {
      if(user.UserId == userId) {
        user.Position = newPosition;
      }
    });
  }



}
