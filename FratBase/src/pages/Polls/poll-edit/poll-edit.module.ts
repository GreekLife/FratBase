import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PollEditPage } from './poll-edit';

@NgModule({
  declarations: [
    PollEditPage,
  ],
  imports: [
    IonicPageModule.forChild(PollEditPage),
  ],
})
export class PollEditPageModule {}
