import type MarkdownIt from 'markdown-it'

const validateInfo = (info: string) => {
  if (!info)
    throw new Error('`info` is required')

  const regex = /^\>\s\[\!([A-Za-z]{3,10})\|?(open|closed)?\]\s?([\S\s]+)?$/
  const match = info.match(regex)
  if (!match)
    return {}

  return {
    type: match[1].toLowerCase(),
    info: match[3],
    open: match[2],
  }
}

const CalloutPlugin: MarkdownIt.PluginSimple = (md: markdownit) => {
  const marker_char = '>'
  const name = 'mditc'
  md.block.ruler.before('blockquote', `callout_${name}`,
    (state, startLine, endLine, silent) => {
      let start = state.bMarks[startLine] + state.tShift[startLine]
      let max = state.eMarks[startLine]
      // check the mark of the line
      if (state.src.charAt(start) !== marker_char)
        return false

      // validate the info (the title)
      const info = state.src.substring(start, max)
      const { type, info: infoText } = validateInfo(info)
      if (!type)
        return false

      if (silent)
        return false

      // search for the end of the block

      let nextLine = startLine

      for (; ;) {
        nextLine++
        if (nextLine >= endLine)
          break

        start = state.bMarks[nextLine] + state.tShift[nextLine]
        max = state.eMarks[nextLine]

        if (state.src.charAt(start) !== marker_char)
          break
      }

      state.lineMax = nextLine

      let token = state.push(`callout_${name}_open`, 'details', 1)
      token.markup = marker_char
      token.block = true

      token.info = info
      token.map = [startLine, nextLine]

      token = state.push('callout_title_open', 'summary', 1)

      token = state.push('callout_icon_open', 'div', 1)
      token = state.push('callout_icon_close', 'div', -1)

      token = state.push('', 'div', 1)

      token = state.push('inline', '', 0)
      token.content = infoText || type.replace(/^\w/, c => c.toUpperCase())
      token.map = [startLine, state.line]
      token.children = []

      token = state.push('', 'div', -1)

      if (startLine + 1 < nextLine) {
        token = state.push('callout_fold_open', 'div', 1)
        token = state.push('callout_fold_close', 'div', -1)
      }

      token = state.push('callout_title_close', 'summary', -1)

      if (startLine + 1 < nextLine)
        state.md.block.tokenize(state, startLine + 1, nextLine)

      token = state.push(`callout_${name}_close`, 'details', -1)
      token.markup = marker_char
      token.block = true

      state.line = nextLine
      if (startLine + 1 < nextLine)
        return true

      // empty block
      state.line++
      return true
    })
  md.renderer.rules[`callout_${name}_open`] = (tokens, idx) => {
    const token = tokens[idx]
    const info = token.info
    const { type, open } = validateInfo(info)
    let html = `<details class="custom-callout ${type}"`

    let shouldOpen = type !== 'example'
    if (open === 'open')
      shouldOpen = true
    else if (open === 'closed')
      shouldOpen = false
    if (shouldOpen)
      html += ' open'

    html += '>'

    return html
  }
  md.renderer.rules[`callout_${name}_close`] = () => '</details>'
  md.renderer.rules.callout_title_open = () => '<summary class="callout-title">'
  md.renderer.rules.callout_title_close = () => '</summary>'
  md.renderer.rules.callout_fold_open = () => '<div class="callout-fold">'
  md.renderer.rules.callout_fold_close = () => '</div>'
  md.renderer.rules.callout_icon_open = () => '<div class="callout-icon">'
  md.renderer.rules.callout_icon_close = () => '</div>'
}

export default CalloutPlugin
