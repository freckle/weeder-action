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
  - uses: actions/checkout@v4
  - id: stack
    uses: freckle/stack-action@v5
  - uses: freckle/weeder-action@v2
    with:
      ghc-version: ${{ steps.stack.outputs.compiler-version }}
```

<!-- action-docs-inputs action="action.yml" -->

## Inputs

| name                | description                                                               | required | default              |
| ------------------- | ------------------------------------------------------------------------- | -------- | -------------------- |
| `ghc-version`       | <p>Full version of GHC your project uses, to ensure HIE compatibility</p> | `true`   | `""`                 |
| `weeder-arguments`  | <p>Arguments to pass when invoking weeder</p>                             | `false`  | `--require-hs-files` |
| `working-directory` | <p>Change to this directory before operating</p>                          | `false`  | `.`                  |
| `fail`              | <p>Fail the build if unused functions found?</p>                          | `false`  | `true`               |

<!-- action-docs-inputs action="action.yml" -->

<!-- action-docs-outputs action="action.yml" -->

## Outputs

| name  | description                                                                                                                                                     |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `log` | <p>Path to a file containing found weeds in JSON format; a list of objects with the keys <code>identifier</code>, <code>file</code>, and <code>line</code>.</p> |

<!-- action-docs-outputs action="action.yml" -->

## Release

To trigger a release (and update the `@v{major}` tag), merge a commit to `main`
that follows [Conventional Commits][]. In short,

- `fix:` to trigger a patch release,
- `feat:` for minor, and
- `feat!:` and major

We don't enforce conventional commits generally (though you are free do so),
it's only required if you want to trigger release.

[conventional commits]: https://www.conventionalcommits.org/en/v1.0.0/#summary

---

[LICENSE](./LICENSE)
