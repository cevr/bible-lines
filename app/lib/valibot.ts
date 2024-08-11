import { Data, Effect } from 'effect';
import * as v from 'valibot';

export class ValibotParsingError<
  S extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
> extends Data.TaggedError('ValibotParsingError')<{
  input: unknown;
  error?: v.ValiError<S>;
}> {}

export function parseValibotSchema<
  S extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
  V,
>(
  schema: S,
  value: V,
): Effect.Effect<v.InferOutput<S>, ValibotParsingError<S>> {
  return Effect.try({
    try: () => v.parse(schema, value),
    catch: (error) => {
      if (v.isValiError(error)) {
        return new ValibotParsingError({
          input: value,
          error: error as v.ValiError<S>,
        });
      }
      return new ValibotParsingError({
        input: value,
      });
    },
  });
}
