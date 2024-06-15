export const handleKeyDownEvent = ({ e, text, setText, textRef }) => {
  // This function is for tab
  if (e.key === "Tab" && !e.shiftKey) {
    // for only tab for forward shift
    e.preventDefault();
    const { selectionStart, selectionEnd } = e.target;
    const start = text.substring(0, selectionStart);
    const end = text.substring(selectionEnd);
    // Insert 2 spaces at the cursor position
    const newText = `${start}  ${end}`;
    setText(newText);

    setTimeout(() => {
      textRef.current.focus();
      textRef.current.setSelectionRange(selectionEnd + 2, selectionEnd + 2);
    }, 0);
  } else if (e.key === "Tab" && e.shiftKey) {
    // for backword shift
    e.preventDefault();
    const { selectionStart } = e.currentTarget;
    const lineStart = text.lastIndexOf("\n", selectionStart - 1) + 1;
    if (text.substring(lineStart, lineStart + 2) === "  ") {
      const newText = `${text.substring(0, lineStart)}${text.substring(
        lineStart + 2
      )}`;
      setText(newText);
      e.target.selectionStart = e.target.selectionEnd = selectionStart - 2;
    }
  } else if (e.key === "Enter") {
    // for new line indentation
    e.preventDefault();
    const { selectionStart, selectionEnd } = e.target;
    const start = text.substring(0, selectionStart);
    const end = text.substring(selectionEnd);
    const lineStart = text.lastIndexOf("\n", selectionStart - 1) + 1;
    const currentLine = text.substring(lineStart, selectionStart);
    const indentMatch = currentLine.match(/^\s*/);
    const indent = indentMatch ? indentMatch[0] : "";
    let newText;
    if (currentLine.trim().endsWith("{")) {
      // Add an extra indentation level for opening brace
      newText = `${start}\n${indent}  \n${indent}${end}`;
      setText(newText);
      setTimeout(() => {
        textRef.current.focus();
        textRef.current.setSelectionRange(
          selectionStart + indent.length + 3,
          selectionStart + indent.length + 3
        );
      }, 0);
    } else {
      newText = `${start}\n${indent}${end}`;
      setText(newText);
      setTimeout(() => {
        textRef.current.focus();
        textRef.current.setSelectionRange(
          selectionStart + indent.length + 1,
          selectionStart + indent.length + 1
        );
      }, 0);
    }
  }
};

export const copyToClipboardEvent = ({ textRef, text, setButtonText }) => {
  // this is for copying entire content
  textRef.current.select();
  navigator.clipboard.writeText(text);
  setButtonText("✔"); // Change button text to '✔'

  // Reset button text to 'Copy' after 2 seconds
  setTimeout(() => {
    setButtonText("Copy");
  }, 2000);
}
