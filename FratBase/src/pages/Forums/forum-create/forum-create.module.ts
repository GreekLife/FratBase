import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ForumCreatePage} from './forum-create';

@NgModule({
  declarations: [
    ForumCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(ForumCreatePage),
  ],
})
export class ForumCreatePageModule {}
