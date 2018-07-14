import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})

export class PostsService {
    // private means can't edit from outside
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    // can inject things into services too
    constructor(private http: HttpClient) {
        
    }


    getPosts() {
        // pull out data from backend 
        // store it in post array
        // fire update listener to inform component we got a new post
        this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
            .pipe(map((postData) => {
                return postData.posts.map(post => {
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id
                    };
                });
            }))
            .subscribe((transformedPost) => {
                this.posts = transformedPost;
                this.postsUpdated.next([...this.posts]);
            });

            // operator are functions that we can use in the observable streams
            // pipe function allows us to add operator, it's a function takes in operators

    }   

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    addPost(title: string, content: string) {
        const post: Post = { id: null, title: title, content: content};
        this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
            .subscribe((data) => {
                console.log(data.message);
                const id = data.postId;
                post.id = id;
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
            });

    }

    deletePost(postId: string){
        this.http.delete("http://localhost:3000/api/posts/" + postId)
            .subscribe(() => {
                const updatedPosts = this.posts.filter(post => post.id !== postId);
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts]);
            })
    }

}