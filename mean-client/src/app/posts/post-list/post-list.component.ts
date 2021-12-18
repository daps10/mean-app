import { Component,Input } from "@angular/core";
import { Post } from "../post.model";
@Component({
    selector:'app-post-list',
    templateUrl:'./post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
    // posts =[
    //     {title:'first post', content:'This is the first post\'s content.'},
    //     {title:'second post', content:'This is the second post\'s content.'},
    //     {title:'third post', content:'This is the third post\'s content.'},
    //     {title:'fourth post', content:'This is the fourth post\'s content.'},
    // ];
    @Input() posts:Post[] = [];
}