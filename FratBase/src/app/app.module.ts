import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';
import {HomePage} from '../pages/Main/home/home';

import {AngularFireModule} from 'angularfire2'
import {AngularFireDatabaseModule} from "angularfire2/database";
import {FIREBASE_CONFIG} from "./firebase.credentials";
import {UsersService} from "../Services/Manage_Users.service";
import {IonicImageViewerModule} from 'ionic-img-viewer';
import {LoginPage} from "../pages/Main/login/login";
import {MembersPage} from "../pages/Member/members/members";
import {ViewMemberPage} from "../pages/Member/view-member/view-member";
import {Tools} from "../Services/Tools";
import {PollsService} from "../Services/Polls.service";
import {ForumService} from "../Services/Forum.service";
import {AngularFireAuthModule} from "angularfire2/auth";
import {IonicStorageModule} from "@ionic/storage";
import {Keyboard} from "@ionic-native/keyboard";
import {ForumPage} from "../pages/Forums/forum/forum";
import {FilterPopoverPage} from "../pages/Forums/filter-popover/filter-popover";
import {ForumCreatePage} from "../pages/Forums/forum-create/forum-create";
import {ForumCommentsPage} from "../pages/Forums/forum-comments/forum-comments";
import {PollPage} from "../pages/Polls/poll/poll";
import {PollCommentsPage} from "../pages/Polls/poll-comments/poll-comments";
import {PollVotePage} from "../pages/Polls/poll-vote/poll-vote";
import {PollFilterPopoverPage} from "../pages/Polls/poll-filter-popover/poll-filter-popover";
import {PollCreatePage} from "../pages/Polls/poll-create/poll-create";
import {ForumEditPage} from "../pages/Forums/forum-edit/forum-edit";
import {TabsPage} from "../pages/Main/tabs/tabs";
import {PollEditPage} from "../pages/Polls/poll-edit/poll-edit";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    MembersPage,
    ViewMemberPage,
    ForumPage,
    FilterPopoverPage,
    ForumCreatePage,
    ForumCommentsPage,
    PollPage,
    PollCommentsPage,
    PollVotePage,
    PollFilterPopoverPage,
    PollCreatePage,
    ForumEditPage,
    TabsPage,
    PollEditPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    IonicImageViewerModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    MembersPage,
    ViewMemberPage,
    ForumPage,
    FilterPopoverPage,
    ForumCreatePage,
    ForumCommentsPage,
    PollPage,
    PollCommentsPage,
    PollVotePage,
    PollFilterPopoverPage,
    PollCreatePage,
    ForumEditPage,
    TabsPage,
    PollEditPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UsersService,
    Tools,
    PollsService,
    ForumService,
    Keyboard
  ]
})
export class AppModule {}
