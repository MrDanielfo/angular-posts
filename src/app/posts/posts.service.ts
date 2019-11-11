import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Post } from './post.model';


@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // GET
  getPosts() {
    this.http
      .get<{ message: string; posts: any }>(
        'http://localhost:3000/api/posts'
      )
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath
          };
        });
      }))
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
    // return [...this.posts];
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ message: string, _id: string, title: string, content: string, post: any, imagePath: string }>(
      `http://localhost:3000/api/posts/${id}`
    );
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image);

    this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts',
                    postData
              ).subscribe((data) => {
                const post: Post = { id: data.post.id, title, content, imagePath: data.post.imagePath };
                // const id = data.postId;
                // post.id = id;
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(['/']);
              });
  }

  // updatePost

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id,
        title,
        content,
        imagePath: image
      };
    }

    this.http
      .put(`http://localhost:3000/api/posts/${id}`, postData)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id,
          title,
          content,
          imagePath: ''
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    this.http.delete(`http://localhost:3000/api/posts/${postId}`)
          .subscribe((data) => {
            // console.log(data);
            const updatedPosts = this.posts.filter(post => post.id !== postId);
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);
          });
  }
}
