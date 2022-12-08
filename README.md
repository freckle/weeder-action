# Weeder Action

GitHub Action to run Weeder to find any unused functions in a Haskell project
and annotate the Build with their locations.

![Example in Diff](./example-in-diff.png)

## Prerequisites

See the [Weeder README][weeder] for project requirements.

[weeder]: https://github.com/ocharles/weeder#readme

You will need to run this step in the same Job as you compile your project, or
make the `.hie` files available some other way.

## Usage

```yaml
steps:
  - uses: actions/checkout@v2
  - uses: freckle/stack-cache-action@v1
  - uses: freckle/stack-action@v3
  - uses: freckle/weeder-action@v1
```

## Inputs

- **ghc-version**: You must specify the `ghc-version` your project
  is compiled with (to ensure `.hie` compatibility).

  This Action maintains and installs pre-compiled `weeder` binaries for Mac and
  Linux across all GHC versions that `weeder` compiles on (8.8.1 to 9.2.5 at
  time of this writing). Please file an Issue if you're using a GHC that's not
  supported, but for which a released version of `weeder` does exist.

- **weeder-arguments**: Arguments to pass when invoking `weeder`

  Default is `--require-hs-files`, which ensures that cached builds that have
  since removed files (but still have their `.hie` files present) don't generate
  false positives.

- **working-directory**: Change to this directory before running.

  This can be necessary if in a mono-repository.

- **fail**: Fail if we find unused functions?

  Default is true. This is useful if you want to not fail the step, but do
  something else with the weeder output yourself.

## Outputs

This Action sets an output named `log` to the path containing the output of
running `weeder`. This can be useful if you use `fail: false` and wish to do
something on that output yourself afterwards.

---

[LICENSE](./LICENSE)
