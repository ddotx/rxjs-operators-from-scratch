import { Observable, Observer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { mySwitchMap } from './switchMap';

test('create our own switchMap operator', (done) => {
    let expectedResult = [1, 1, 2, 2, 2];

    const getObs = (index: number) => {
        return new Observable((observer: Observer<number>) => {
            observer.next(index);
            setTimeout(() => observer.next(index), 20);
            setTimeout(() => observer.next(index), 40);
            setTimeout(() => observer.complete(), 50);
        });
    };

    new Observable((observer: Observer<number>) => {
        observer.next(1);
        setTimeout(() => observer.next(2), 30);
        setTimeout(() => observer.complete(), 100);
    }).pipe(
        mySwitchMap((val: number) => getObs(val))
    ).subscribe(val => {
            const expected = expectedResult.shift();
            expect(val).toBe(expected)
        },
        (err: any) => {
        },
        () => done()
    );
});

// <editor-fold desc="geObs">
// geObs     v--v--v-|
// </editor-fold>
// <editor-fold desc="marble">
// geObs     v--v--v-|
// source$:  x----x---|
//           |    \
//           \     2--2--2-|
//            1--1!
// result$   -1--1-2--2--2-|
// </editor-fold>