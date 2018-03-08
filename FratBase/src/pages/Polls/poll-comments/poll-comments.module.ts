import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {PollCommentsPage} from './poll-comments';

@NgModule({
  declarations: [
    PollCommentsPage,
  ],
  imports: [
    IonicPageModule.forChild(PollCommentsPage),
  ],
})
export class PollCommentsPageModule {}
