import {Component} from "@angular/core";
import {HomePage} from "../home/home";
import {ForumPage} from "../../Forums/forum/forum";
import {PollPage} from "../../Polls/poll/poll";


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ForumPage;
  tab3Root = PollPage;

  constructor() {

  }
}
