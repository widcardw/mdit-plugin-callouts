import { describe, expect, it } from 'vitest'
import { md } from '../src/custom-renderer'

describe('custom renderer', () => {
  it('shuold render block quote', () => {
    expect(md.render('> Hello world\n>\n> hi')).toMatchInlineSnapshot(`
      "<div>
      <p>Hello world</p>
      <p>hi</p>
      </div>"
    `)
  })
})
