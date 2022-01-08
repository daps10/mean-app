// EventEmitter, Output during event binding time needed
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    form!: FormGroup;
    // when we use service that time we dont require it
    // @Output() postCreated = new EventEmitter();

    constructor(
        public postService:PostService, 
        public route:ActivatedRoute,

        ) {}

    ngOnInit(): void {
        this.form = new FormGroup({
            title: new FormControl(null, {
                validators:[
                    Validators.required, 
                    Validators.minLength(4)
                ]            
            }),
            content : new FormControl(null, {
                validators: [
                    Validators.required
                ]
            }),
            image: new FormControl(null, {
                validators:[
                    Validators.required                    
                ]
            })
        });

        this.route.paramMap.subscribe((paramMap:ParamMap) => {
            if(paramMap.has('postId')){
                this.mode="edit";
                this.postId= paramMap.get("postId");
                this.isLoading=true;
                this.postService.getPost(this.postId).subscribe(postData => {
                    this.isLoading=false;
                    this.post = {id:postData._id, title:postData.title,content:postData.content}
                    this.form.setValue({
                        title: this.post.title,
                        content:this.post.content
                    })
                });               
            } else {
                this.mode="create";
                this.postId= null
            }
        })
    }

    onImagePicked(event:Event) {
        const file = (event.target as HTMLInputElement).files?[0]:"";
        this.form.patchValue({image:file});
        this.form.get("image")?.updateValueAndValidity();
        console.log(file);
        console.log(this.form);
    }

    onSavePost(){
        if(this.form.invalid) {
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
            this.postService.addPost(this.form.value.title, this.form.value.content)
                   
        } else {
            this.postService.updatePost(
                this.postId,
                this.form.value.title, 
                this.form.value.content
                )
                this.isLoading=false;
        }
        this.form.reset();
    }



}