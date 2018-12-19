import { Applicative, Monad, Traversable } from './types/Applicative';

export class Right<T>
    implements Traversable<T, 'Either', 'Right'>, Monad<T, 'Either', 'Right'> {
    public static of<A>(value: A): Right<A> {
        return new Right(value);
    }
    public kind: 'Either';
    public name: 'Right';
    public readonly value: T;
    constructor(value: T) {
        this.value = value;
    }
    public map<A>(fn: (v: T) => A): Right<A> {
        return new Right(fn(this.value));
    }
    public flatten() {
        return this.value;
    }
    public chain<A>(fn: (v: T) => Right<A>): Right<A>;
    public chain<A>(fn: (v: T) => Left<A>): Left<A>;
    public chain<A>(fn: (v: T) => Right<A> | Left<A>): Right<A> | Left<A> {
        return this.map(fn).flatten();
    }
    public ap<A, B>(this: Right<(v: A) => B>, other: Right<A>): Right<B> {
        return this.map(fn => fn(other.flatten()));
    }
    public catch(): Right<T> {
        return this;
    }
    public traverse<A, N, K>(
        {},
        fn: (v: T) => Applicative<A, N, K>,
    ): Applicative<Right<A>, N, K> {
        return fn(this.value).map<Right<A>>(Right.of);
    }
    public sequence<A, N, K>(this: Right<Applicative<A, N, K>>, of: {}) {
        return this.traverse(of, v => v);
    }
}

export class Left<T>
    implements Traversable<T, 'Either', 'Left'>, Monad<T, 'Either', 'Left'> {
    public static of<A>(value: A): Left<A> {
        return new Left(value);
    }
    public kind: 'Either';
    public name: 'Left';
    public readonly value: T;
    constructor(value: T) {
        this.value = value;
    }
    public map({}): Left<T> {
        return this;
    }
    public flatten(): Left<T> {
        return this;
    }
    public chain({}): Left<T> {
        return this;
    }
    public ap({}): Left<T> {
        return this;
    }
    public catch(): Right<T> {
        return Right.of(this.value);
    }
    public traverse<N, K>(
        of: (v: Left<T>) => Applicative<Left<T>, N, K>,
        {},
    ): Applicative<Left<T>, N, K> {
        return of(this);
    }
    public sequence<N, K>(
        of: (v: Left<T>) => Applicative<Left<T>, N, K>,
    ): Applicative<Left<T>, N, K> {
        return this.traverse(of, {});
    }
}
