import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForumCommentsPage } from './forum-comments';

@NgModule({
  declarations: [
    ForumCommentsPage,
  ],
  imports: [
    IonicPageModule.forChild(ForumCommentsPage),
  ],
})
export class ForumCommentsPageModule {}
