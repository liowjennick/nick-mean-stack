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
    private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

    // can inject things into services too
    constructor(private http: HttpClient, private router: Router) {
        
    }


    getPosts(postsPerPage: number, currentPage: number) {
        // query pagination
        const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;

        // pull out data from backend 
        // store it in post array
        // fire update listener to inform component we got a new post
        this.http.get<{message: string, posts: any, maxPosts: number }>('http://localhost:3000/api/posts' + queryParams)
            .pipe(map((postData) => {
                return { posts: postData.posts.map(post => {
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id,
                        imagePath: post.imagePath
                    };
                }), maxPosts: postData.maxPosts }
            }))
            .subscribe((transformedPostData) => {
                this.posts = transformedPostData.posts;
                this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostData.maxPosts});
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

        return this.http.get<{_id: string, title: string, content: string, imagePath: string}>("http://localhost:3000/api/posts/" + id);
    }

    addPost(title: string, content: string, image: File) {
        // const post: Post = { id: null, title: title, content: content};

        // data value that allows us to contains text value and blobs(file value)
        // create new form data to allow image to be added
        const postData = new FormData();
        postData.append("title", title);
        postData.append("content", content);
        postData.append("image", image, title);

        this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
            .subscribe((data) => {
                this.router.navigate(["/"]);
            });

    }

    updatePost(id:string, title: string, content: string, image: File | string) {
        // const post: Post = {
        //     id: id,
        //     title: title,
        //     content: content,
        //     imagePath: null
        // }
        let postData: Post | FormData;
        if (typeof(image) === 'object') {
            // create form data object
            postData = new FormData();
            postData.append("id", id);
            postData.append("title", title);
            postData.append("content", content);
            postData.append("image", image, title);

        } else {
            // string -- send normal json data
            postData = {
                id: id, 
                title: title,
                content: content,
                imagePath: image
            };
        }

        this.http
            .put("http://localhost:3000/api/posts/" + id, postData)
            .subscribe(response => {
                this.router.navigate(["/"]);
            });


    }

    deletePost(postId: string){
        return this.http
            .delete("http://localhost:3000/api/posts/" + postId);

    }

}