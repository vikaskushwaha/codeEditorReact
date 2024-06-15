import { useState, useRef, useEffect } from "react";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import useCompileCode from "../../hooks/useCompileCode";
import { DEFAULT_CODE, SELECT_LANGUAGE_OPTIONS } from "../../configuration/compilerConfiguration";
import { copyToClipboardEvent, handleKeyDownEvent } from "../../utils/compilerUtils";

const CodeEditor = () => {
  const [compilerLanguage, setCompilerLanguage] = useState("js");
  const [text, setText] = useState(DEFAULT_CODE[compilerLanguage]);
  const [buttonText, setButtonText] = useState("Copy");
  const preRef = useRef(null);
  const textRef = useRef(null);
  const highlighted = highlight(
    text,
    languages[compilerLanguage],
    compilerLanguage
  );
  const { outputLink, compiling, compileError, compileCode } =
    useCompileCode(text);

  useEffect(() => {
    setText(DEFAULT_CODE[compilerLanguage]);
  }, [compilerLanguage]);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    handleKeyDownEvent({ e, text, setText, textRef });
  };

  const copyToClipboard = () => {
    copyToClipboardEvent({textRef, text, setButtonText});
  };

  const handleClick = async () => {
    compileCode(text, compilerLanguage);
  };

  return (
    <div className="code-editor-parent-container">
      <h3>Live Code Editor</h3>
      <button className="compile-btn" onClick={handleClick}>
        Run
      </button>
      <pre
        className="overlay-code"
        {...{ dangerouslySetInnerHTML: { __html: highlighted + "<br />" } }}
        ref={preRef}
      />
      <textarea
        ref={textRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        onScroll={(e) => {
          preRef.current.scrollTop = e.target.scrollTop;
        }}
      ></textarea>
      <button className="copy-btn" onClick={copyToClipboard}>
        {buttonText}
      </button>
      <select
        className="language-select"
        value={compilerLanguage}
        onChange={(e) => setCompilerLanguage(e.target.value)}
        style={{ marginBottom: "10px" }}
      >
        {SELECT_LANGUAGE_OPTIONS.map(({value, title})=>(
            <option key={value} value={value}>{title}</option>
        ))}
      </select>
      <div
        className={`compile-result ${
          outputLink && "code-compilation-successful"
        } 
      ${compileError && "code-compilation-failure"} ${
          compiling && "compiling"
        } `}
      >
        {compiling ? (
          <p>Compiling...</p>
        ) : (
          <>
            {compileError && <p>{compileError}</p>}
            {outputLink && (
              <a href={outputLink} target="_blank" rel="noreferrer">
                Output Link
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
