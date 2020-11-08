import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import firebase from 'firebase';

@Component({
  selector: 'iwp-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCardComponent {
  @Input()
  user: firebase.User = {} as firebase.User;

  @Output()
  logoutClick = new EventEmitter<null>();

  logout(): void {
    this.logoutClick.emit();
  }
}
