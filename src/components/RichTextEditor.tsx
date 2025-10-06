import { useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const quillRef = useRef<ReactQuill>(null);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "blockquote",
    "code-block",
    "link",
  ];

  return (
    <div className="rich-editor-wrapper">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Tell your story..."}
        className="bg-card"
      />
      <style>{`
        .rich-editor-wrapper .ql-container {
          min-height: 400px;
          font-size: 1rem;
          border-bottom-left-radius: var(--radius);
          border-bottom-right-radius: var(--radius);
        }
        .rich-editor-wrapper .ql-toolbar {
          border-top-left-radius: var(--radius);
          border-top-right-radius: var(--radius);
          background: hsl(var(--card));
          border-color: hsl(var(--border));
        }
        .rich-editor-wrapper .ql-container {
          border-color: hsl(var(--border));
        }
        .rich-editor-wrapper .ql-editor {
          color: hsl(var(--foreground));
        }
        .rich-editor-wrapper .ql-editor.ql-blank::before {
          color: hsl(var(--muted-foreground));
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
