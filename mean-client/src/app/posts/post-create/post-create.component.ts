import { Component, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';

// decorator
@Component({
    selector:'app-post-create',
    templateUrl:'./post-create.component.html',
    styleUrls:['./post-create.component.css']
})
export class PostCreateComponent {
    enteredTitle = '';
    enteredContent = '';

    @Output() postCreated = new EventEmitter();

    newPost='NO CONTENT';

    onPostCreate(){
        const post:Post = {
            title:this.enteredTitle, 
            content:this.enteredContent
        }
        // this.newPost = this.enteredValue;
        this.postCreated.emit(post);
    }

}