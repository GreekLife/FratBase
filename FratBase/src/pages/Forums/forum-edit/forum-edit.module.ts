import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForumEditPage } from './forum-edit';

@NgModule({
  declarations: [
    ForumEditPage,
  ],
  imports: [
    IonicPageModule.forChild(ForumEditPage),
  ],
})
export class ForumEditPageModule {}
