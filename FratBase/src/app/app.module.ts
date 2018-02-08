import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import {AngularFireModule } from 'angularfire2'
import {AngularFireDatabaseModule} from "angularfire2/database";
import {FIREBASE_CONFIG} from "./firebase.credentials";
import {UsersService} from "../Services/Manage_Users.service";
import { IonicImageViewerModule } from 'ionic-img-viewer';
import {LoginPage} from "../pages/login/login";
import {MembersPage} from "../pages/members/members";
import {ViewMemberPage} from "../pages/view-member/view-member";
import {Tools} from "../Services/Tools";
import {PollsService} from "../Services/Polls.service";
import {ForumService} from "../Services/Forum.service";
import {AngularFireAuthModule} from "angularfire2/auth";
import {IonicStorageModule} from "@ionic/storage";
import {Keyboard} from "@ionic-native/keyboard";
import {ForumPage} from "../pages/forum/forum";
import {FilterPopoverPage} from "../pages/filter-popover/filter-popover";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    MembersPage,
    ViewMemberPage,
    ForumPage,
    FilterPopoverPage
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
    FilterPopoverPage
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
