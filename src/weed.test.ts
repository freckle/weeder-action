import {parseWeed, parseWeeds} from './weed.js'

describe('parseWeed', () => {
  it('parses a weed from one line of weeder output', () => {
    const result = parseWeed('src/Main.hs:42: Main.goodbyeWorld')

    expect(result).toEqual({
      file: 'src/Main.hs',
      line: 42,
      identifier: 'Main.goodbyeWorld'
    })
  })

  it('rejects invalid lines', () => {
    const result = parseWeed('Other output: invalid config: x')

    expect(result).toBeNull()
  })

  it('rejects valid but malformed line number', () => {
    const result = parseWeed('src/Main.hs:hi: Main.goodbyeWorld')

    expect(result).toBeNull()
  })
})

describe('parseWeeds', () => {
  it('parses every weed line and drops the rest', () => {
    const stdout = [
      'src/Lib.hs:7: Lib.goodbyeWorld',
      'Other output: invalid config: x',
      'app/Main.hs:12: Main.unused',
      ''
    ].join('\n')

    expect(parseWeeds(stdout)).toEqual([
      {file: 'src/Lib.hs', line: 7, identifier: 'Lib.goodbyeWorld'},
      {file: 'app/Main.hs', line: 12, identifier: 'Main.unused'}
    ])
  })

  it('returns no weeds for output with none', () => {
    expect(parseWeeds('')).toEqual([])
  })
})
