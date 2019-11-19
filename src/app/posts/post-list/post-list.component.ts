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
  totalPosts = 0;
  postsPerPage = 3;
  currentPage = 1;
  pageSizeOptions = [1, 3 , 5, 10];
  private postsSub: Subscription;

  // al declarar el public crear una propiedad con el mismo nombre automáticamente
  constructor(public postsService: PostsService) {

  }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
                      .subscribe((postData: { posts: Post[], totalPosts: number}) => {
                        setTimeout(() => {
                          this.isLoading = false;
                        }, 300);
                        this.totalPosts = postData.totalPosts;
                        this.posts = postData.posts;
                      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
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
