import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})

export class PostsService {
    // private means can't edit from outside
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    // can inject things into services too
    constructor(private http: HttpClient, private router: Router) {
        
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

    getPost(id:string) {
        // find post with same id and put them in a new js object
        // return {...this.posts.find((p) => p.id === id)};

        return this.http.get<{_id: string, title: string, content: string}>("http://localhost:3000/api/posts/" + id);
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
                this.router.navigate(["/"]);
            });

    }

    updatePost(id:string, title: string, content: string) {
        const post: Post = {
            id: id,
            title: title,
            content: content
        }

        this.http
            .put("http://localhost:3000/api/posts/" + id, post)
            .subscribe(response => {
                const updatedPosts = [...this.posts];
                const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
                updatedPosts[oldPostIndex] = post;
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(["/"]);
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