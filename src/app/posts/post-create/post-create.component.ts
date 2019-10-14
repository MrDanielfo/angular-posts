import { Component } from '@angular/core';
// EventEmitter, Output
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent {
  enteredContent = '';
  enteredTitle = '';

  // todo lo que se hace aquí, se puede hacer en un service

  constructor(public postsService: PostsService) {

  }

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.postsService.addPost(form.value.title, form.value.content);

  }

}

// postInput: HTMLTextAreaElement
// console.log(postInput);
// this.newPost = this.enteredValue;

// this.enteredTitle
// this.enteredContent

// @Output() postCreated = new EventEmitter<Post>();
// this.postCreated.emit(post);

// const post: Post = {
//   title: form.value.title,
//   content: form.value.content
// };

// import { Post } from '../post.model';
