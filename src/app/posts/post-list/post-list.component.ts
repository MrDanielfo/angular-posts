import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postsSub: Subscription;

  // al declarar el public crear una propiedad con el mismo nombre automáticamente
  constructor(public postsService: PostsService) {

  }

  ngOnInit() {
    this.posts = this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
                      .subscribe((posts: Post[]) => {
                        this.posts = posts;
                      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

}

// {
//   title: 'First Post',
//     content: 'This is awesome'
// },
// {
//   title: 'Second Post',
//     content: 'This is awesome too'
// },
// {
//   title: 'Third Post',
//     content: 'This is awful'
// }

// postsService: PostsService;
// this.postsService = postsService;
// @Input()
