import { Injectable } from '@angular/core';
import { Post } from './post.model'
import { Subject } from 'rxjs'

@Injectable({
    providedIn:'root'
})
export class PostService {
    private posts:Post[] = [];
    private postUpdated = new Subject<Post[]>();
    getPost(){
        // return [... this.posts];
        return this.posts;
    }

    getPostUpdatedListener(){
        return this.postUpdated.asObservable();
    }

    addPost(title:string, content: string) {
        const post: Post = {title:title, content:content}
        this.posts.push(post);
        this.postUpdated.next([...this.posts])
    }
}