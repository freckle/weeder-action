export type Weed = {
  file: string;
  line: number;
  identifier: string;
};

export function parseWeeds(stdout: string): Weed[] {
  return mapMaybe(stdout.split("\n"), parseWeed);
}

export function parseWeed(input: string): Weed | null {
  const match = input.match(
    /^(?<file>[^:]+):(?<line>\d+):\s*(?<identifier>.*)$/,
  );
  const groups = match?.groups;

  if (groups) {
    return {
      file: groups.file,
      line: parseInt(groups.line, 10),
      identifier: groups.identifier,
    };
  }

  return null;
}

function mapMaybe<A, B>(xs: A[], f: (x: A) => B | null): B[] {
  const result: B[] = [];

  for (const x of xs) {
    const mapped = f(x);

    if (mapped !== null) {
      result.push(mapped);
    }
  }

  return result;
}
