import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs'
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import { Post } from './post.model';

const BACKEND_URL= environment.apiUrl + "/posts/";

@Injectable({
    providedIn:'root'
})
export class PostService {
    private posts:Post[] = [];
    private postUpdated = new Subject<{posts:Post[], postCount:number}>();

    // inject http in service
    constructor(private http: HttpClient, private router:Router) {}

    getPosts(postPerPage:number, currentPage:number){
        const queryParams= `?pageSize=${postPerPage}&page=${currentPage}`;
        this.http.get<{message:string, posts:any, maxPosts:number}>(
            BACKEND_URL + queryParams
        )
        .pipe(
            map((postData) =>{
                return { posts: postData.posts.map((post: { title: any; content: any; _id: any; imagePath:any; creator:any; }) => {
                    return {
                        title:post.title,
                        content:post.content,
                        id:post._id,
                        imagePath:post.imagePath,
                        creator:post.creator
                    };
                }), maxPosts : postData.maxPosts}
            })
        )
        .subscribe((transFormedPostData) => {
            this.posts = transFormedPostData.posts;
            this.postUpdated.next({
                posts : [...this.posts], 
                postCount:transFormedPostData.maxPosts
            }) 
        });
    }

    getPostUpdatedListener(){
        return this.postUpdated.asObservable();
    }

    getPost(id:string) {
        return this.http.get<{
            _id:string, 
            title:string, 
            content:string, 
            imagePath:string, 
            creator:any 
        }>( BACKEND_URL + id );
    }

    addPost(title:string, content: string, image:File) {
        // const post: Post = {id:"", title:title, content:content}
        const postData = new FormData();
        postData.append("title", title);
        postData.append("content", content);
        postData.append("image", image, title);

        this.http.post<{message:string, post:Post}>(BACKEND_URL, postData)
            .subscribe((responseData) => {
                this.router.navigate(["/"])
            });

    }

    updatePost(id:string, title:string, content: string, image:File | string) {
        let postData:Post | FormData;
        if(typeof image == 'object'){
            postData = new FormData();
            postData.append("id", id);
            postData.append("title", title);
            postData.append("content", content);
            postData.append("image", image, title);
        } else {
            postData = {
                id:id, 
                title:title, 
                content:content, 
                imagePath:image,
                creator:""
            }
        }

        this.http.put<{message:string, postId:string}>(BACKEND_URL + id, postData)
            .subscribe((responseData) => {
            //    const updatedPosts =[...this.posts]
            //    const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
            
            //    const post: Post = {
            //        id:id, 
            //        title:title, 
            //        content:content, 
            //        imagePath:""
            //    }
            //    updatedPosts[oldPostIndex] = post;
            //    this.posts = updatedPosts;
            //    this.postUpdated.next([...this.posts])
               this.router.navigate(["/"])
            });

    }

    deletePost(id:string) {
        // this.http.delete(BACKEND_URL + id)
        //     .subscribe(() => {
        //         const updatedPost = this.posts.filter(post => post.id !== id);
        //         this.posts = updatedPost;
        //         this.postUpdated.next([...this.posts]); 
        //     })

        return this.http.delete(BACKEND_URL + id);
    }
}