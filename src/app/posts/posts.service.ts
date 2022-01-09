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
                return postData.posts.map((post: { title: any; content: any; _id: any; imagePath:any; }) => {
                    return {
                        title:post.title,
                        content:post.content,
                        id:post._id,
                        imagePath:post.imagePath
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
        return this.http.get<{_id:string, title:string, content:string, imagePath:string }>(
            "http://localhost:3000/api/posts/" + id);
    }

    addPost(title:string, content: string, image:File) {
        // const post: Post = {id:"", title:title, content:content}
        const postData = new FormData();
        postData.append("title", title);
        postData.append("content", content);
        postData.append("image", image, title);

        this.http.post<{message:string, post:Post}>("http://localhost:3000/api/posts", postData)
            .subscribe((responseData) => {
                const post: Post = { 
                    id:responseData.post.id,
                    title:title,
                    content:content,
                    imagePath:responseData.post.imagePath
                }
                this.posts.push(post);
                this.postUpdated.next([...this.posts])
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
                imagePath:image
            }
        }

        this.http.put<{message:string, postId:string}>("http://localhost:3000/api/posts/" + id, postData)
            .subscribe((responseData) => {
               const updatedPosts =[...this.posts]
               const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
            
               const post: Post = {
                   id:id, 
                   title:title, 
                   content:content, 
                   imagePath:""
               }
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