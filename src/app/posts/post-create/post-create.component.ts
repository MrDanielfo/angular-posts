import { Component, OnInit } from '@angular/core';
// EventEmitter, Output
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {
  enteredContent = '';
  enteredTitle = '';
  post: Post;
  isLoading = false;

  private mode = 'create';
  private postId: string;

  // todo lo que se hace aquí, se puede hacer en un service

  constructor(public postsService: PostsService, public route: ActivatedRoute) {

  }

  // Paso para llenar los campos con el post que se va a editar

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
          this.mode = 'edit';
          this.postId = paramMap.get('postId');
          // Spinner
          this.isLoading = true;
          this.postsService.getPost(this.postId).subscribe(postData => {
            //
            setTimeout(() => {
              this.isLoading = false;
            }, 500);
            this.post = {id: postData.post._id, title: postData.post.title, content: postData.post.content };
          });
      } else {
          this.mode = 'create';
          this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;

    if (this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      this.postsService.updatePost(this.postId, form.value.title, form.value.content);
    }

    form.resetForm();
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
