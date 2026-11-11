function isMarginNote(tokens, index) {
  const opening = tokens[index];
  const [marker, lineBreak] = tokens[index + 2]?.children ?? [];

  return opening?.type === "blockquote_open"
    && opening.level === 0
    && tokens[index + 1]?.type === "paragraph_open"
    && marker?.type === "text"
    && marker.content === "[!MARGIN]"
    && lineBreak?.type === "softbreak";
}

export default function marginNotes(markdown) {
  markdown.core.ruler.after("inline", "margin_notes", (state) => {
    const { tokens } = state;
    const output = [];

    function appendHtml(html) {
      const token = new state.Token("html_block", "", 0);
      token.block = true;
      token.content = html + "\n";
      output.push(token);
    }

    for (let index = 0; index < tokens.length;) {
      if (!isMarginNote(tokens, index)) {
        output.push(tokens[index++]);
        continue;
      }

      const previous = output.at(-1);
      const besideParagraph = previous?.type === "paragraph_close" && previous.level === 0;

      if (besideParagraph) {
        const paragraph = output.splice(-3);
        appendHtml('<div class="annotated-passage">');
        output.push(...paragraph);
        appendHtml('<div class="margin-notes">');
      }

      do {
        const opening = tokens[index];
        let closing = index + 3;
        while (tokens[closing].level > 0) closing++;

        opening.tag = "aside";
        opening.attrSet("class", "margin-note");
        opening.attrSet("role", "note");
        opening.attrSet("aria-label", "Margin note");
        tokens[closing].tag = "aside";
        tokens[index + 2].children.splice(0, 2);

        output.push(...tokens.slice(index, closing + 1));
        index = closing + 1;
      } while (isMarginNote(tokens, index));

      if (besideParagraph) appendHtml("</div>\n</div>");
    }

    state.tokens = output;
  });
}
