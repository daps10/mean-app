import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model'
import { Subject } from 'rxjs'
import { Router } from '@angular/router';

import { map } from 'rxjs/operators'

@Injectable({
    providedIn:'root'
})
export class PostService {
    private posts:Post[] = [];
    private postUpdated = new Subject<Post[]>();

    // inject http in service
    constructor(private http: HttpClient, private router:Router) {}

    getPosts(){
        this.http.get<{message:string, posts:any}>(
            "http://localhost:3000/api/posts"
        )
        .pipe(
            map((postData) =>{
                return postData.posts.map((post: { title: any; content: any; _id: any; }) => {
                    return {
                        title:post.title,
                        content:post.content,
                        id:post._id
                    };
                })
            })
        )
        .subscribe((transFormedPosts) => {
            this.posts = transFormedPosts;
            this.postUpdated.next([...this.posts]) 
        });
    }

    getPostUpdatedListener(){
        return this.postUpdated.asObservable();
    }

    getPost(id:string) {
        return this.http.get<{_id:string, title:string, content:string }>(
            "http://localhost:3000/api/posts/" + id);
    }

    addPost(title:string, content: string, image:File) {
        // const post: Post = {id:"", title:title, content:content}
        const postData = new FormData();
        postData.append("title", title);
        postData.append("content", content);
        postData.append("image", image, title);

        this.http.post<{message:string, postId:string}>("http://localhost:3000/api/posts", postData)
            .subscribe((responseData) => {
                const post: Post = { 
                    id:responseData.postId,
                    title:title,
                    content:content
                }
                const postId = responseData.postId;
                post.id = postId;
                this.posts.push(post);
                this.postUpdated.next([...this.posts])
                this.router.navigate(["/"])
            });

    }

    updatePost(id:string, title:string, content: string) {
        const post: Post = {id:id, title:title, content:content}
        this.http.put<{message:string, postId:string}>("http://localhost:3000/api/posts/" + id, post)
            .subscribe((responseData) => {
               const updatedPosts =[...this.posts]
               const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
               updatedPosts[oldPostIndex] = post;
               this.posts = updatedPosts;
               this.postUpdated.next([...this.posts])
               this.router.navigate(["/"])
            });

    }

    deletePost(id:string) {
        this.http.delete("http://localhost:3000/api/posts/" + id)
            .subscribe(() => {
                const updatedPost = this.posts.filter(post => post.id !== id);
                this.posts = updatedPost;
                this.postUpdated.next([...this.posts]); 
            })
    }
}