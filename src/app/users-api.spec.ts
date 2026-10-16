import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UsersApi } from './users-api';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

describe('UsersApi', () => {
  let api: UsersApi;
  let httpTesting: HttpTestingController;

  beforeEach(()=> {
    TestBed.configureTestingModule({
      providers: [
        UsersApi,
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });

    api = TestBed.inject(UsersApi);
    httpTesting = TestBed.inject(HttpTestingController);
  })

  afterEach(()=> {
    httpTesting.verify();
  })

  it('loads users from the API', async () => {
    const users = [
      {
        id: 1,
        name: 'John Doe1'
      },
      {
        id: 2,
        name: 'Jane Doe2'
      }
    ];

    const resultPromise = firstValueFrom(api.getUsers());
    const request = httpTesting.expectOne({
      method: 'GET',
      url: '/api/users'
    });

    request.flush(users);

    const result = await resultPromise;

    expect(result).toEqual(users);
  });

  it('propagates server errors', async () => {
    const resultPromise = firstValueFrom(api.getUsers());
    const request = httpTesting.expectOne({
      method: 'GET',
      url: '/api/users'
    });

    request.flush(
      {message: 'Service unavailable'},
      {
        status: 503,
        statusText: 'Service unavailable'
      }
    );

    await expect(resultPromise).rejects.toMatchObject({
      status: 503,
      statusText: 'Service unavailable'
    })
  });

  it('creates a user with the expected request body', async () => {
    const resultPromise = firstValueFrom(api.createUser('Anna'));

    const request = httpTesting.expectOne({
      method: 'POST',
      url: '/api/users'
    });

    expect(request.request.body).toEqual({name: 'Anna'});

    request.flush({
      id: 1,
      name: 'Anna'
    });

    const result = await resultPromise;

    expect(result).toEqual({
      id: 1,
      name: 'Anna'
    })
  });
})