import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
import {Item} from "ionic-angular";

@Injectable()
export class UsersService {

  private userListRef = this.db.list<Item>('Development/Users');

  constructor(private db: AngularFireDatabase) {

  }

  getJonah() {
    return this.userListRef;
  }

}
