import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import CalloutPlugin from '../src/index'

const md = new MarkdownIt()

md.use(CalloutPlugin)

describe('md', () => {
  it.skip('should render default blockquotes', () => {
    expect(md.render('> hello world\n>\n> hi')).toMatchInlineSnapshot(`
      "<blockquote>
      <p>hello world</p>
      <p>hi</p>
      </blockquote>
      "
    `)
  })

  it('should render callout block', () => {
    expect(md.render(`
> [!tip] This is a callout
> Although it is nothing here.
> A new line here.`)).toMatchInlineSnapshot(`
  "<details class=\\"custom-callout tip\\" open><summary class=\\"callout-title\\"><div class=\\"callout-icon\\"></div><div>This is a callout</div>
  <div class=\\"callout-fold\\"></div></summary><div class=\\"callout-body\\">
  <p>Although it is nothing here.
  A new line here.</p>
  </div>
  </details>"
`)
  })
})
