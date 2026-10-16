import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
}

@Service()
export class UsersApi {
  private readonly http = inject(HttpClient);

  getUsers(): Observable<readonly User[]> {
    return this.http.get<readonly User[]>('/api/users');
  }

  createUser(name: string): Observable<User> {
    return this.http.post<User>('/api/users', { name });
  }

  searchUsers(query: string): Observable<readonly User[]> {
    return this.http.get<readonly User[]>('/api/users', {
      params: { query },
    });
  }
}
