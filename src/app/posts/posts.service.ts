import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model'
import { Subject } from 'rxjs'

@Injectable({
    providedIn:'root'
})
export class PostService {
    private posts:Post[] = [];
    private postUpdated = new Subject<Post[]>();

    // inject http in service
    constructor(private http: HttpClient) {}

    getPost(){
        this.http.get<{message:string, posts:Post[]}>("http://localhost:3000/api/posts")
            .subscribe((postData) => {
                this.posts = postData.posts;
                this.postUpdated.next([...this.posts]) 
            });
    }

    getPostUpdatedListener(){
        return this.postUpdated.asObservable();
    }

    addPost(title:string, content: string) {
        const post: Post = {id:"", title:title, content:content}
        this.http.post<{message:string}>("http://localhost:3000/api/posts", post)
            .subscribe((responseData) => {
                console.log(responseData.message)
                this.posts.push(post);
                this.postUpdated.next([...this.posts])
            });

    }
}