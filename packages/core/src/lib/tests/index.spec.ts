import { timer } from 'rxjs';

describe('jestTest', () => {
  it('should dispatch the loader', done => {
    let a = 1;

    timer(0).subscribe(() => {
      expect(a).toBe(1);
      done();
    });
  });

  test('should a', () => {
    const array = [
      { key: 1 },
      { key: 2 }
    ];

    expect(array).toEqual([
      { key: 1 },
      { key: 2 }
    ]);

  });
});
