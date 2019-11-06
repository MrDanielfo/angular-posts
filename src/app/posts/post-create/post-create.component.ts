import { Component, OnInit } from '@angular/core';
// EventEmitter, Output
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  form: FormGroup;
  imagePreview: string;

  private mode = 'create';
  private postId: string;

  // todo lo que se hace aquí, se puede hacer en un service

  constructor(public postsService: PostsService, public route: ActivatedRoute) {

  }

  // Paso para llenar los campos con el post que se va a editar

  ngOnInit() {
    this.form = new FormGroup({
      title : new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      content: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      image: new FormControl(null, { validators: [Validators.required] })
    });
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
            this.form.setValue({
              title: this.post.title,
              content: this.post.content
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
      this.postsService.addPost(this.form.value.title, this.form.value.content);
    } else {
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content);
    }

    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
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
