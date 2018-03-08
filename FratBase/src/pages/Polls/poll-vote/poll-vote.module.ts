import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {PollVotePage} from './poll-vote';

@NgModule({
  declarations: [
    PollVotePage,
  ],
  imports: [
    IonicPageModule.forChild(PollVotePage),
  ],
})
export class PollVotePageModule {}
