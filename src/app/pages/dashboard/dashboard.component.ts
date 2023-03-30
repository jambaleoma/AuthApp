import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  userID = this.authService.getCurrentUserId();
  user$ = this.authService.getCurrentUser();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logOut() {
    this.authService.signOut();
    this.router.navigateByUrl('/');
  }

  log(user: User) {
    console.log(user);
  }

}
