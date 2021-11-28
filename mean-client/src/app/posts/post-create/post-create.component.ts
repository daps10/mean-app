import { Component } from '@angular/core';


// decorator
@Component({
    selector:'app-post-create',
    templateUrl:'./post-create.component.html',
    styleUrls:['./post-create.component.css']
})
export class PostCreateComponent {
    enteredValue = '';
    newPost='NO CONTENT';

    onPostCreate(){
        this.newPost = this.enteredValue;
    }

}