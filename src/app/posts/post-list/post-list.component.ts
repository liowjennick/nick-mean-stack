import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})

export class PostListComponent {
    // posts = [
    //     {
    //         title: 'First Post',
    //         content: 'This is the content of first post'
    //     },
    //     {
    //         title: 'Second Post',
    //         content: 'This is the content of second post'
    //     },
    //     {
    //         title: 'Third Post',
    //         content: 'This is the content of third post'
    //     }
    // ]
    @Input() posts = []
}