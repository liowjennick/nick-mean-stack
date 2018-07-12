import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})

export class PostsService {
    // private means can't edit from outside
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    getPosts() {
        // ... pull out data from array and add it in 
        // creating new array with old objects
        return [...this.posts];
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    addPost(title: string, content: string) {
        const post: Post = {title: title, content: content};
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
    }

}