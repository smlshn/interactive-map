import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@services';
import { Router } from '@angular/router';

@Component({
  selector: 'iwp-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.loginViaGoogle().subscribe((response) => {
      if (response) {
        this.router.navigate(['/detail']);
      }
    });
  }
}
