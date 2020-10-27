import { Either } from 'fp-ts/Either';
import { either } from 'fp-ts';
import { pipe } from 'fp-ts/function';

type MaybePromise<T> = T | PromiseLike<T>;

const chainTasks = async <A, B1 = void, B2 = void, B3 = void, B4 = void, B5 = void, B6 = void, B7 = void>(
  task1: () => MaybePromise<Either<A, B1>>,
  task2?: (b1: B1) => MaybePromise<Either<A, B2>>,
  task3?: (b1: B1, B2: B2) => MaybePromise<Either<A, B3>>,
  task4?: (b1: B1, b2: B2, b3: B3) => MaybePromise<Either<A, B4>>,
  task5?: (b1: B1, b2: B2, b3: B3, b4: B4) => MaybePromise<Either<A, B5>>,
  task6?: (b1: B1, b2: B2, b3: B3, b4: B4, b5: B5) => MaybePromise<Either<A, B6>>,
  task7?: (b1: B1, b2: B2, b3: B3, b4: B4, b5: B5, b6: B6) => MaybePromise<Either<A, B7>>,
): Promise<Either<A, [B1, B2, B3, B4, B5, B6, B7]>> => {
  const progress: [B1, B2, B3, B4, B5, B6, B7] = [] as any;

  for (const t of [task1, task2, task3, task4, task5, task6, task7] as const) {
    if (t) {
      const step: Either<A, any> = await (t as any)(...progress);
      if (either.isLeft(step)) {
        return step;
      } else {
        progress.push(step.right);
      }
    } else {
      break;
    }
  }

  return either.right(progress);
};

const chainTasksT /* T for tail */ = async <
  A,
  B1 = void,
  B2 = void,
  B3 = void,
  B4 = void,
  B5 = void,
  B6 = void,
  B7 = void
>(
  task1: () => MaybePromise<Either<A, B1>>,
  task2?: (b1: B1) => MaybePromise<Either<A, B2>>,
  task3?: (b1: B1, B2: B2) => MaybePromise<Either<A, B3>>,
  task4?: (b1: B1, b2: B2, b3: B3) => MaybePromise<Either<A, B4>>,
  task5?: (b1: B1, b2: B2, b3: B3, b4: B4) => MaybePromise<Either<A, B5>>,
  task6?: (b1: B1, b2: B2, b3: B3, b4: B4, b5: B5) => MaybePromise<Either<A, B6>>,
  task7?: (b1: B1, b2: B2, b3: B3, b4: B4, b5: B5, b6: B6) => MaybePromise<Either<A, B7>>,
): Promise<
  Either<
    A,
    B7 extends void
      ? B6 extends void
        ? B5 extends void
          ? B4 extends void
            ? B3 extends void
              ? B2 extends void
                ? B1 extends void
                  ? void
                  : B1
                : B2
              : B3
            : B4
          : B5
        : B6
      : B7
  >
> => {
  return pipe(
    await chainTasks(task1, task2, task3, task4, task5, task6, task7),
    either.map((_) => _.pop() as any),
  );
};

export const eitherChain = {
  tasks: chainTasks,
  tasksT: chainTasksT,
} as const;
