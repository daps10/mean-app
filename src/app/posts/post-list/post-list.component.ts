import { Component,Input, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
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
    isLoading=false;
    totalPosts=0;
    postsPerPage=2;
    currentPage=1;
    pageSizeOptions=[1,2,5,10];
    private postsSub!: Subscription;

    constructor(public postsService:PostService) {}

    ngOnInit(): void {
        this.isLoading=true;
        this.postsService.getPosts(this.postsPerPage, this.currentPage); // get post service called
        this.postsSub = this.postsService.getPostUpdatedListener()
            .subscribe( (postsData:({posts : Post[], postCount:number})) => {
                this.isLoading=false;
                this.totalPosts= postsData.postCount
                this.posts=postsData.posts;
            })
    }

    onChangePage(pageData:PageEvent) {
        this.isLoading=true;
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;

        this.postsService.getPosts(this.postsPerPage, this.currentPage)
    }

    onDelete(postId:string) {
        this.isLoading=true;
        this.postsService.deletePost(postId).subscribe(() => {
            this.postsService.getPosts(this.postsPerPage, this.currentPage)
        })
            
    }

    ngOnDestroy(): void {
        this.postsSub.unsubscribe();
    }
}