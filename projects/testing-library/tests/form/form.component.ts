import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'login-form',
  templateUrl: './form.component.html',
})
export class LoginFormComponent {
  @Output()
  handleLogin = new EventEmitter<{ username: string; password: string }>();

  loginForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  handleSubmit() {
    if (this.loginForm.valid) {
      this.handleLogin.emit(this.loginForm.value);
    }
  }
}
