import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";

export const CKEditorField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}> = ({ label, value, onChange, error }) => (
  <div className="flex flex-col gap-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="ckeditor-container mt-4 text-black">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        onChange={(event, editor) => onChange(editor.getData())}
        config={{
          toolbar: [
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "blockQuote",
            "undo",
            "redo",
          ],
        }}
      />
    </div>
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);
