// EventEmitter, Output during event binding time needed
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { PostService } from '../posts.service';

// decorator
@Component({
    selector:'app-post-create',
    templateUrl:'./post-create.component.html',
    styleUrls:['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
    enteredTitle = '';
    enteredContent = '';
    isLoading = false;
    private mode = 'create';
    private postId: any;
    public post: any;

    // when we use service that time we dont require it
    // @Output() postCreated = new EventEmitter();

    constructor(public postService:PostService, public route:ActivatedRoute) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe((paramMap:ParamMap) => {
            if(paramMap.has('postId')){
                this.mode="edit";
                this.postId= paramMap.get("postId");
                this.isLoading=true;
                this.postService.getPost(this.postId).subscribe(postData => {
                    this.isLoading=false;
                    this.post = {id:postData._id, title:postData.title,content:postData.content}
                });               
            } else {
                this.mode="create";
                this.postId= null
            }
        })
    }

    onSavePost(form:NgForm){
        if(form.invalid) {
            return
        }

        this.isLoading=true;
        if(this.mode == "create"){
            // const post:Post = {
            //     title:form.value.title, 
            //     content:form.value.content
            // }
            // this.newPost = this.enteredValue;
            // this.postCreated.emit(post);
    
            this.isLoading=false;
            // with the help of service
            this.postService.addPost(form.value.title, form.value.content)
                   
        } else {
            this.postService.updatePost(
                this.postId,
                form.value.title, 
                form.value.content
                )
                this.isLoading=false;
        }
        form.resetForm();
    }

}