import { cleanWeederVersion } from "../src/weeder";

describe("cleanWeederVersion", () => {
  describe("valid version strings", () => {
    const examples = [
      ["a simple version", "weeder version 2.8.0\n", "2.8.0"],
      ["with hie version", "weeder version 2.7.0\nhie version 1.4.0", "2.7.0"],
    ];

    it.each(examples)("parses %s", (_, input, expected) => {
      expect(cleanWeederVersion(input)).toBe(expected);
    });
  });

  describe("invalid version strings", () => {
    const examples = [
      ["nonsense", "blah blah"],
      ["too few parts", "weeder version 1.2"],
      ["too many parts", "weeder 2.8.0.1"],
    ];

    it.each(examples)("throws on %s", (_, input) => {
      expect(() => {
        cleanWeederVersion(input);
      }).toThrow("Could not parse");
    });
  });
});
