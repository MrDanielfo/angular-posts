import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  isLoading = false;
  totalPosts = 10;
  postsPerPage = 3;
  pageSizeOptions = [1, 3 , 5, 10];
  private postsSub: Subscription;

  // al declarar el public crear una propiedad con el mismo nombre automáticamente
  constructor(public postsService: PostsService) {

  }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
                      .subscribe((posts: Post[]) => {
                        setTimeout(() => {
                          this.isLoading = false;
                        }, 500);
                        this.posts = posts;
                      });
  }

  onChangedPage(pageData: PageEvent) {
    console.log(pageData);
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
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
