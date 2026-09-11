import * as core from '@actions/core'

import {getInputs} from './inputs.js'

vi.mock(import('@actions/core'), () => {
  return {
    getInput: vi.fn(),
    getMultilineInput: vi.fn(),
    getBooleanInput: vi.fn()
  } as never
})

describe(getInputs.name, () => {
  it('reads every action input', () => {
    vi.mocked(core.getInput).mockImplementation(name =>
      name === 'ghc-version' ? '9.6.6' : 'subdir'
    )
    vi.mocked(core.getMultilineInput).mockReturnValue(['--require-hs-files'])
    vi.mocked(core.getBooleanInput).mockReturnValue(true)

    expect(getInputs()).toEqual({
      ghcVersion: '9.6.6',
      weederArguments: ['--require-hs-files'],
      workingDirectory: 'subdir',
      fail: true
    })

    expect(core.getInput).toHaveBeenCalledWith('ghc-version', {required: true})
    expect(core.getInput).toHaveBeenCalledWith('working-directory', {required: true})
    expect(core.getMultilineInput).toHaveBeenCalledWith('weeder-arguments', {required: true})
    expect(core.getBooleanInput).toHaveBeenCalledWith('fail', {required: true})
  })
})
