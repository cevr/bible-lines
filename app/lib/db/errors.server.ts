import { Data } from 'effect';

export class DatabaseError extends Data.TaggedError('DatabaseError' as const)<{
  message: string;
  cause: unknown;
}> {}
