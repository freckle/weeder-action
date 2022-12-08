# Weeder Action

GitHub Action to run Weeder to find any unused functions in a Haskell project
and annotate the Build with their locations.

![Example in Diff](./example-in-diff.png)

## Prerequisites

See the [Weeder README][weeder] for project requirements.

[weeder]: https://github.com/ocharles/weeder#readme

You will need to run this step in the same Job as you compile your project, or
make the `.hie` files available some other way.

[stack]: https://docs.haskellstack.org/en/stable/README/

## Usage

```yaml
steps:
  - uses: actions/checkout@v2
  - uses: freckle/stack-cache-action@v1
  - uses: freckle/stack-action@v3
  - uses: freckle/weeder-action@v1
```

## Inputs

- **weeder-version**: The version of `weeder` to install and run

  This Action use pre-compiled `weeder` binaries we maintain for Mac and Linux
  runners. You must use a `weeder-version` appropriate for the GHC version your
  project is compiled with (to ensure `.hie` compatibility).

  | GHC  | `weeder-version` |         |
  | ---- | ---------------- | ------- |
  | 9.2  | 2.4.0            | default |
  | 9.0  | 2.3.1            |         |
  | 8.10 | 2.2.0            |         |

- **weeder-arguments**: Arguments to pass when invoking `weeder`

  Default is `--require-hs-files`, which ensures that cached builds which have
  since removed files (but still have their `.hie` files present) don't generate
  false positives.

- **working-directory**: Change to this directory before running.

  This can be necessary if in a mono-repository.

## Outputs

This Action sets an output named `log` to the path containing the output of
running `weeder`. This can be useful if you use `fail: false` and wish to do
something on that output yourself afterwards.

---

[LICENSE](./LICENSE)
