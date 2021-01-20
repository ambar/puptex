const puptex = require('../src/puptex')

describe('puptex', () => {
  beforeAll(async () => {
    puptex.config({
      concurrency: 1,
      mathJax: {
        TeX: {
          Macros: {
            bm: '\\boldsymbol',
          },
        },
      },
    })
    await puptex.launch()
  })

  afterAll(() => {
    puptex.close()
  })

  it('renders empty', async () => {
    const data = await puptex.renderMath('')
    expect(data).toMatchSnapshot()
  })

  it('renders tex', async () => {
    const data = await puptex.renderMath('E=mc^2')
    expect(data).toMatchSnapshot()
  })

  it('renders `parse error`', async () => {
    const data = await puptex.renderMath('E=mc^')
    expect(data).toMatchSnapshot()
  })

  it('clears global glyphs cache', async () => {
    const math = 'E=mc^2'
    const [a, b] = await Promise.all([
      puptex.renderMath(math),
      puptex.renderMath(math),
    ])
    expect(a.svg).toEqual(b.svg)
  })

  it('renders with `16px` font-size', async () => {
    const data = await puptex.renderMath('', {fontSize: '16px'})
    expect(data).toMatchSnapshot()
  })

  it('renders CJK characters correctly', async () => {
    const data = await puptex.renderMath('\\text{拾玖}^i')
    expect(data).toMatchSnapshot()
  })

  it('renders `\\bm`', async () => {
    const data = await puptex.renderMath('\\bm{x}')
    expect(data).toMatchSnapshot()
  })

  // it('renders MathML', async () => {
  //   const data = await puptex.renderMath('x', {mml: true})
  //   expect(data).toMatchSnapshot()
  // })
})
