import { useState } from "react";
import {
  ContentState,
  Editor,
  EditorState,
  RichUtils,
  convertFromHTML,
} from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "draft-js/dist/Draft.css";

interface DraftEditorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const StyleButton: React.FC<{
  style: string;
  label: string;
  toggleStyle: (style: string) => void;
}> = ({ style, label, toggleStyle }) => (
  <button
    type="button"
    onClick={() => toggleStyle(style)}
    className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-300"
  >
    {label}
  </button>
);

export const DraftEditorField: React.FC<DraftEditorFieldProps> = ({
  label,
  value,
  onChange,
  error,
}) => {
  const [editorState, setEditorState] = useState(() => {
    const contentBlock = convertFromHTML(value);
    const contentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks
    );
    return EditorState.createWithContent(contentState);
  });

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
    const htmlContent = stateToHTML(state.getCurrentContent());
    onChange(htmlContent);
  };

  const handleKeyCommand = (command: string) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const toggleInlineStyle = (style: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (blockType: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="toolbar flex gap-2 mb-2">
        <StyleButton
          style="BOLD"
          label="Bold"
          toggleStyle={toggleInlineStyle}
        />
        <StyleButton
          style="ITALIC"
          label="Italic"
          toggleStyle={toggleInlineStyle}
        />
        <StyleButton
          style="UNDERLINE"
          label="Underline"
          toggleStyle={toggleInlineStyle}
        />
        <StyleButton
          style="header-one"
          label="H1"
          toggleStyle={toggleBlockType}
        />
        <StyleButton
          style="header-two"
          label="H2"
          toggleStyle={toggleBlockType}
        />
      </div>
      <div className="mt-4 dark:text-white border border-gray-300 rounded p-2 min-h-[150px]">
        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
          handleKeyCommand={handleKeyCommand}
        />
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};
