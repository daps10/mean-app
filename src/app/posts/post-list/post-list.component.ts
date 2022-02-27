import { Component,Input, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";

import { Post } from "../post.model";
import { PostService } from "../posts.service";
@Component({
    selector:'app-post-list',
    templateUrl:'./post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
    posts:Post[] = [];
    isLoading=false;
    totalPosts=0;
    postsPerPage=2;
    currentPage=1;
    pageSizeOptions=[1,2,5,10];
    userIsAuthenticated= false;
    userId:any;
    private postsSub!: Subscription;
    private authServiceSub!: Subscription;

    constructor(
        public postsService:PostService, 
        private authService:AuthService
    ) {}
    
    ngOnInit(): void {
        this.isLoading=true;
        this.postsService.getPosts(this.postsPerPage, this.currentPage); // get post service called
        this.userId= this.authService.getUserId();
        this.postsSub = this.postsService.getPostUpdatedListener()
            .subscribe( (postsData:({posts : Post[], postCount:number})) => {
                this.isLoading=false;
                this.totalPosts= postsData.postCount
                this.posts=postsData.posts;
            })

        this.userIsAuthenticated= this.authService.getIsAuth();

        this.authServiceSub= this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
            this.userIsAuthenticated= isAuthenticated;
            this.userId= this.authService.getUserId();
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
        this.authServiceSub.unsubscribe();
    }
}