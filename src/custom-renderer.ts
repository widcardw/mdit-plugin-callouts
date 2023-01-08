import MarkdownIt from 'markdown-it'
import type { RenderRule } from 'markdown-it/lib/renderer'
// import Token from 'markdown-it/lib/token'

const md = new MarkdownIt()

const proxy: RenderRule = (tokens, idx, options, env, self) => self.renderToken(tokens, idx, options)

const defaultBlockquoteOpenRenderer = md.renderer.rules.blockquote_open || proxy
const defaultBlockquoteCloseRenderer = md.renderer.rules.blockquote_close || proxy

md.renderer.rules.blockquote_open = (tokens, idx, options, env, self) => {
  tokens[idx].hidden = true
  return `${defaultBlockquoteOpenRenderer(tokens, idx, options, env, self)}<div>`
}

md.renderer.rules.blockquote_close = (tokens, idx, options, env, self) => {
  tokens[idx].hidden = true
  return `</div>${defaultBlockquoteCloseRenderer(tokens, idx, options, env, self)}`
}

export {
  md,
}
