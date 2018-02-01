import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewMemberPage } from './view-member';

@NgModule({
  declarations: [
    ViewMemberPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewMemberPage),
  ],
})
export class ViewMemberPageModule {}
