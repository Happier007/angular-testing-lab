import { inject, Service } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { UsersApi } from './users-api';

@Service()
export class UserSearch {
  private readonly usersApi = inject(UsersApi);
  private readonly querySubject = new Subject<string>();

  readonly results$ = this.querySubject.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((query) => this.usersApi.searchUsers(query)),
  );

  search(query: string): void {
    this.querySubject.next(query.trim());
  }
}
