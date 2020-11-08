import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService, LocalStorageService } from '@services';
import { ActivatedRoute, Router } from '@angular/router';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

@Component({
  selector: 'iwp-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  faSignOutAlt = faSignOutAlt;
  searchVisible$: Observable<boolean>;

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
  ) {}

  ngOnInit(): void {
    this.searchVisible$ = this.route.data.pipe(
      pluck('searchVisible'),
      map((visible: boolean) => (typeof visible === 'boolean' ? visible : true)),
    );
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/logout']);
      this.localStorageService.clear();
    });
  }
}
