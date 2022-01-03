import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model'
import { Subject } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable({
    providedIn:'root'
})
export class PostService {
    private posts:Post[] = [];
    private postUpdated = new Subject<Post[]>();

    // inject http in service
    constructor(private http: HttpClient) {}

    getPost(){
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

    addPost(title:string, content: string) {
        const post: Post = {id:"", title:title, content:content}
        this.http.post<{message:string, postId:string}>("http://localhost:3000/api/posts", post)
            .subscribe((responseData) => {
                const postId = responseData.postId;
                post.id = postId;
                this.posts.push(post);
                this.postUpdated.next([...this.posts])
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