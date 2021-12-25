// EventEmitter, Output during event binding time needed
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../post.model';
import { PostService } from '../posts.service';

// decorator
@Component({
    selector:'app-post-create',
    templateUrl:'./post-create.component.html',
    styleUrls:['./post-create.component.css']
})
export class PostCreateComponent {
    enteredTitle = '';
    enteredContent = '';

    // when we use service that time we dont require it
    // @Output() postCreated = new EventEmitter();

    constructor(public postService:PostService) {}

    onPostCreate(form:NgForm){
        if(form.invalid) {
            return
        }
        // const post:Post = {
        //     title:form.value.title, 
        //     content:form.value.content
        // }
        // this.newPost = this.enteredValue;
        // this.postCreated.emit(post);

        // with the help of service
        this.postService.addPost(form.value.title, form.value.content)
        form.resetForm();       
    }

}