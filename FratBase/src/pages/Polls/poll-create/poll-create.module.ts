import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {PollCreatePage} from './poll-create';

@NgModule({
  declarations: [
    PollCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(PollCreatePage),
  ],
})
export class PollCreatePageModule {}
