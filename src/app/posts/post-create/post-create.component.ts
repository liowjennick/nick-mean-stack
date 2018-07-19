import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {
    enteredTitle = '';
    enteredContent = '';
    private mode = 'create';
    private postId: string;
    post: Post;
    // top level object for reactive form
    form: FormGroup;
    imagePreview: string;
    isLoading = false;

    constructor(public postsService: PostsService, public route: ActivatedRoute) {}

    ngOnInit() {
        this.form = new FormGroup({
            // first argument is the beginning state of the form
            // second argument is a js object validators
            'title': new FormControl(null, {
                validators: [Validators.required, Validators.minLength(3)]
            }),
            'content': new FormControl(null, {
                validators: [Validators.required]
            }),
            'image': new FormControl(null, {
                validators: [Validators.required],
                asyncValidators: [mimeType]
            })
        });

        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            // checking if url has postId
            if (paramMap.has('postId')) {
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                this.isLoading = true;
                this.postsService.getPost(this.postId).subscribe(postData => {
                    this.isLoading = false;
                    this.post = {
                        id: postData._id, 
                        title: postData.title, 
                        content: postData.content,
                        imagePath: postData.imagePath
                    };
                    this.form.setValue({
                        'title': this.post.title, 
                        'content': this.post.content,
                        'image': this.post.imagePath
                    });
                });
        
            } else {
                this.mode = 'create';
                this.postId = null;
            }
        });
    }

    onSavePost() {
        if (this.form.invalid) {
              return;
        }

        this.isLoading = true;

        if (this.mode === 'create') {
            this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
        } else {
            this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image)
        }

        this.form.reset();
    }

    onImagePicked(event: Event) {
        // type conversion, this entire element will have an html input element which will have a file
        const file = (event.target as HTMLInputElement).files[0]; //need to store this in form control
        // target a single form control
        this.form.patchValue({image: file});
        // changed the value and tells angular it should reevaluate that
        this.form.get('image').updateValueAndValidity();
        const reader = new FileReader();

        // image preview
        reader.onload = () => {
            // when its done loading a file
            // the result will be the url
            this.imagePreview = reader.result;
        };
        reader.readAsDataURL(file);
    }
}