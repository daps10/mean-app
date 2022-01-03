import { Component,Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { Post } from "../post.model";
import { PostService } from "../posts.service";
@Component({
    selector:'app-post-list',
    templateUrl:'./post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
    // posts =[
    //     {title:'first post', content:'This is the first post\'s content.'},
    //     {title:'second post', content:'This is the second post\'s content.'},
    //     {title:'third post', content:'This is the third post\'s content.'},
    //     {title:'fourth post', content:'This is the fourth post\'s content.'},
    // ];
    // @Input() posts:Post[] = [];

    posts:Post[] = [];
    private postsSub!: Subscription;

    constructor(public postsService:PostService) {}

    ngOnInit(): void {
        this.postsService.getPost(); // get post service called
        this.postsSub = this.postsService.getPostUpdatedListener()
            .subscribe( (posts:Post[]) => {
                this.posts=posts;
            })
    }

    onDelete(postId:string) {
        this.postsService.deletePost(postId)
            
    }

    ngOnDestroy(): void {
        this.postsSub.unsubscribe();
    }
}