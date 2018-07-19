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
                        id: post._id,
                        imagePath: post.imagePath
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
                const post: Post = {
                    id: data.post.id, 
                    content: content, 
                    title: title,
                    imagePath: data.post.imagePath
                };
                console.log(data.message);
                const id = data.post.id;
                post.id = id;
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
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
                const updatedPosts = [...this.posts];
                const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
                const post: Post = {
                    id: id,
                    title: title,
                    content: content, 
                    imagePath: "response.imagePath"
                }
                updatedPosts[oldPostIndex] = post;
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(["/"]);
            });


    }

    deletePost(postId: string){
        this.http.delete("http://localhost:3000/api/posts/" + postId)
            .subscribe(() => {
                // return all results from outdated posts that doesnt include the recently deleted post
                const updatedPosts = this.posts.filter(post => post.id !== postId);
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts]);
            })
    }

}