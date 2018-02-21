import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PollFilterPopoverPage } from './poll-filter-popover';

@NgModule({
  declarations: [
    PollFilterPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(PollFilterPopoverPage),
  ],
})
export class PollFilterPopoverPageModule {}
