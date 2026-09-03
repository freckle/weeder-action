import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as tc from '@actions/tool-cache'

vi.mock(import('@actions/core'), () => {
  return {group: vi.fn(), info: vi.fn(), debug: vi.fn()} as never
})

vi.mock(import('@actions/exec'), () => {
  return {getExecOutput: vi.fn()} as never
})

vi.mock(import('@actions/tool-cache'), () => {
  return {downloadTool: vi.fn(), extractTar: vi.fn(), extractZip: vi.fn()} as never
})

import {cleanWeederVersion, runWeeder} from './weeder.js'

describe('cleanWeederVersion', () => {
  describe('valid version strings', () => {
    const examples = [
      ['a simple version', 'weeder version 2.8.0\n', '2.8.0'],
      ['with hie version', 'weeder version 2.7.0\nhie version 1.4.0', '2.7.0']
    ]

    it.each(examples)('parses %s', (_, input, expected) => {
      expect(cleanWeederVersion(input)).toBe(expected)
    })
  })

  describe('invalid version strings', () => {
    const examples = [
      ['nonsense', 'blah blah'],
      ['too few parts', 'weeder version 1.2'],
      ['too many parts', 'weeder 2.8.0.1']
    ]

    it.each(examples)('throws on %s', (_, input) => {
      expect(() => {
        cleanWeederVersion(input)
      }).toThrow('Could not parse')
    })
  })
})

describe('runWeeder', () => {
  const originalPlatform = process.platform

  // installWeeder branches on process.platform, so pin it per test rather than
  // letting the host OS decide which archive format is exercised.
  function setPlatform(platform: string): void {
    Object.defineProperty(process, 'platform', {value: platform, configurable: true})
  }

  // stdout for `weeder --version`, then for the weeder run itself
  function stubExec(version: string, run: {exitCode: number; stdout: string}): void {
    vi.mocked(exec.getExecOutput).mockImplementation(async (_weeder, args) => {
      const output = args?.[0] === '--version' ? {exitCode: 0, stdout: version} : run
      return {...output, stderr: ''}
    })
  }

  beforeEach(() => {
    setPlatform('linux')
    vi.mocked(core.group).mockImplementation(async (_name, fn) => await fn())
    vi.mocked(tc.downloadTool).mockResolvedValue('/tmp/archive')
    vi.mocked(tc.extractTar).mockResolvedValue('/tmp/extracted')
    vi.mocked(tc.extractZip).mockResolvedValue('/tmp/extracted')
  })

  afterEach(() => {
    Object.defineProperty(process, 'platform', {value: originalPlatform, configurable: true})
  })

  it('downloads and extracts a tarball on non-Windows', async () => {
    stubExec('weeder version 2.8.0', {exitCode: 0, stdout: ''})

    await runWeeder('9.6.6', ['--require-hs-files'], 'example')

    expect(tc.downloadTool).toHaveBeenCalledWith(
      `https://github.com/freckle/weeder-action/releases/download/Binaries/weeder-9.6.6-linux-${process.arch}.tar.gz`
    )
    expect(tc.extractTar).toHaveBeenCalledWith('/tmp/archive')
    expect(tc.extractZip).not.toHaveBeenCalled()
    expect(exec.getExecOutput).toHaveBeenCalledWith('/tmp/extracted/weeder', ['--version'])
  })

  it('downloads and extracts a zip on Windows', async () => {
    setPlatform('win32')
    stubExec('weeder version 2.8.0', {exitCode: 0, stdout: ''})

    await runWeeder('9.6.6', [], 'example')

    expect(tc.downloadTool).toHaveBeenCalledWith(
      `https://github.com/freckle/weeder-action/releases/download/Binaries/weeder-9.6.6-win32-${process.arch}.zip`
    )
    expect(tc.extractZip).toHaveBeenCalledWith('/tmp/archive')
    expect(tc.extractTar).not.toHaveBeenCalled()
  })

  it('runs weeder in the given directory, ignoring its exit code', async () => {
    stubExec('weeder version 2.8.0', {exitCode: 0, stdout: ''})

    await runWeeder('9.6.6', ['--require-hs-files'], 'example')

    expect(exec.getExecOutput).toHaveBeenCalledWith(
      '/tmp/extracted/weeder',
      ['--require-hs-files'],
      {cwd: 'example', ignoreReturnCode: true}
    )
  })

  it('returns no weeds on a clean run', async () => {
    stubExec('weeder version 2.8.0', {exitCode: 0, stdout: ''})

    expect(await runWeeder('9.6.6', [], 'example')).toEqual([])
  })

  it('returns weeds when a trusted weeder exits 228', async () => {
    stubExec('weeder version 2.8.0', {
      exitCode: 228,
      stdout: 'src/Lib.hs:7: Lib.goodbyeWorld\n'
    })

    expect(await runWeeder('9.6.6', [], 'example')).toEqual([
      {file: 'src/Lib.hs', line: 7, identifier: 'Lib.goodbyeWorld'}
    ])
  })

  it('falls back to parsed output for weeder older than 2.7.0', async () => {
    // 2.4.0 exits 1 for weeds as well as for errors, so only stdout tells them apart
    stubExec('weeder version 2.4.0', {
      exitCode: 1,
      stdout: 'src/Lib.hs:7: Lib.goodbyeWorld\n'
    })

    expect(await runWeeder('9.2.8', [], 'example')).toEqual([
      {file: 'src/Lib.hs', line: 7, identifier: 'Lib.goodbyeWorld'}
    ])
  })

  it('throws when weeder fails without reporting weeds', async () => {
    stubExec('weeder version 2.8.0', {exitCode: 1, stdout: 'invalid config'})

    await expect(runWeeder('9.6.6', [], 'example')).rejects.toThrow(
      'Weeder encountered a non-weeds error'
    )
  })

  it('throws when weeder --version fails', async () => {
    vi.mocked(exec.getExecOutput).mockResolvedValue({exitCode: 127, stdout: '', stderr: ''})

    await expect(runWeeder('9.6.6', [], 'example')).rejects.toThrow(
      'weeder --version failed with exit code 127'
    )
  })
})
