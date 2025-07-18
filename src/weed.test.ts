import { parseWeed } from "./weed";

describe("parseWeed", () => {
  it("parses a weed from one line of weeder output", () => {
    const result = parseWeed("src/Main.hs:42: Main.goodbyeWorld");

    expect(result).toEqual({
      file: "src/Main.hs",
      line: 42,
      identifier: "Main.goodbyeWorld",
    });
  });

  it("rejects invalid lines", () => {
    const result = parseWeed("Other output: invalid config: x");

    expect(result).toBeNull();
  });

  it("rejects valid but malformed line number", () => {
    const result = parseWeed("src/Main.hs:hi: Main.goodbyeWorld");

    expect(result).toBeNull();
  });
});
