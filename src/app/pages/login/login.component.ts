import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  user: User = {};

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}
  
  onSubmit() {
    console.log('SUBMIT', this.form.value);
    const { email, password } = this.form.getRawValue();
    this.authService.login(email, password).subscribe({
      next: (res) => {
        console.log('LOGIN DONE: ', res);
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.error = 'Login Failed :(';
      }
    });
  }

  createAccount() {
    console.log('CREATE', this.form.value);
    const { email, password } = this.form.getRawValue();
    this.authService.register(this.user).subscribe({
      next: (res) => {
        console.log('REGISTER DONE: ', res);
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.error = 'Registration Failed :(';
      }
    });
  }
}
