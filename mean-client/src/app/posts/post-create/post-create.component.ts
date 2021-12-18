import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
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

    onPostCreate(form:NgForm){
        if(form.invalid) {
            return
        }
        const post:Post = {
            title:form.value.title, 
            content:form.value.content
        }
        // this.newPost = this.enteredValue;
        this.postCreated.emit(post);
    }

}