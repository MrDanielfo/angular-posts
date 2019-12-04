import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
// EventEmitter, Output
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mite-type.validator';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit, OnDestroy {
  enteredContent = '';
  enteredTitle = '';
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;

  private mode = 'create';
  private postId: string;
  private authStatusSub: Subscription;

  // todo lo que se hace aquí, se puede hacer en un service

  constructor(public postsService: PostsService, public route: ActivatedRoute, private authService: AuthService) {

  }

  // Paso para llenar los campos con el post que se va a editar

  ngOnInit() {

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });

    this.form = new FormGroup({
      title : new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      content: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
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
            this.post = { id: postData.post._id,
                          title: postData.post.title,
                          content: postData.post.content,
                          imagePath: postData.post.imagePath,
                          creator: postData.creator
                        };
            this.form.setValue({
              title: this.post.title,
              content: this.post.content,
              image: this.post.imagePath
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
      this.postsService.addPost(this.form.value.title,
                                this.form.value.content,
                                this.form.value.image);
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
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

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
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
