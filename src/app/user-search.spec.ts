import { TestBed } from '@angular/core/testing';
import { UserSearch } from './user-search';
import { User, UsersApi } from './users-api';
import { firstValueFrom, of, Subject, Subscription } from 'rxjs';

describe('UserSearch', () => {
  const usersApiStub = {
    searchUsers: vi.fn<UsersApi['searchUsers']>(),
  } satisfies Pick<UsersApi, 'searchUsers'>;

  let search: UserSearch;
  let resultsSubscription: Subscription | undefined;

  beforeEach(() => {
    vi.useFakeTimers();
    usersApiStub.searchUsers.mockReset();

    TestBed.configureTestingModule({
      providers: [
        UserSearch,
        {
          provide: UsersApi,
          useValue: usersApiStub,
        },
      ],
    });

    search = TestBed.inject(UserSearch);
  });

  afterEach(() => {
    resultsSubscription?.unsubscribe();
    resultsSubscription = undefined;
    vi.useRealTimers();
  });

  it('searches only after the 300 ms debounce', async () => {
    const users = [
      {
        id: 1,
        name: 'Anna',
      },
    ] as const;

    usersApiStub.searchUsers.mockReturnValue(of(users));

    const resultPromise = firstValueFrom(search.results$);

    search.search(' Anna ');

    vi.advanceTimersByTime(299);
    expect(usersApiStub.searchUsers).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);

    expect(usersApiStub.searchUsers).toHaveBeenCalledWith('Anna');
    expect(usersApiStub.searchUsers).toHaveBeenCalledOnce();

    await expect(resultPromise).resolves.toEqual(users);
  });

  it('does not search again when the normalized query has not changed', () => {
    usersApiStub.searchUsers.mockReturnValue(of([]));
    resultsSubscription = search.results$.subscribe();
    search.search('Anna');

    vi.advanceTimersByTime(300);

    search.search(' Anna ');

    vi.advanceTimersByTime(300);

    expect(usersApiStub.searchUsers).toHaveBeenCalledWith('Anna');
    expect(usersApiStub.searchUsers).toHaveBeenCalledOnce();
  });

  it('searches only for the latest query in a rapid sequence', () => {
    usersApiStub.searchUsers.mockReturnValue(of([]));
    resultsSubscription = search.results$.subscribe();

    search.search('A');
    vi.advanceTimersByTime(100);

    search.search('An');
    vi.advanceTimersByTime(100);

    search.search('Anna');
    vi.advanceTimersByTime(299);

    expect(usersApiStub.searchUsers).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);

    expect(usersApiStub.searchUsers).toHaveBeenCalledWith('Anna');
    expect(usersApiStub.searchUsers).toHaveBeenCalledOnce();
  });

  it('ignores stale results after switching to a newer query', () => {
    const annaRequest$ = new Subject<readonly User[]>();
    const johnRequest$ = new Subject<readonly User[]>();

    usersApiStub.searchUsers
      .mockReturnValueOnce(annaRequest$)
      .mockReturnValueOnce(johnRequest$);

    const onResult = vi.fn<(users: readonly User[]) => void>();
    resultsSubscription = search.results$.subscribe(onResult);

    search.search('Anna');
    vi.advanceTimersByTime(300);

    search.search('John');
    vi.advanceTimersByTime(300);

    expect(usersApiStub.searchUsers).toHaveBeenNthCalledWith(1, 'Anna');
    expect(usersApiStub.searchUsers).toHaveBeenNthCalledWith(2, 'John');
    expect(usersApiStub.searchUsers).toHaveBeenCalledTimes(2);

    annaRequest$.next([
      {
        id: 1,
        name: 'Anna',
      },
    ]);

    expect(onResult).not.toHaveBeenCalled();

    const johnUsers = [
      {
        id: 2,
        name: 'John',
      },
    ];

    johnRequest$.next(johnUsers);

    expect(onResult).toHaveBeenCalledWith(johnUsers);
    expect(onResult).toHaveBeenCalledOnce();
  });
});
