
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  language?: "english" | "tamil";
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'align': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'blockquote'],
    [{ 'color': [] }, { 'background': [] }],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'align',
  'list', 'bullet',
  'link', 'blockquote',
  'color', 'background'
];

export function RichTextEditor({ content, onChange, language = "english" }: RichTextEditorProps) {
  const placeholder = language === "english" 
    ? "Start writing your blog post..."
    : "உங்கள் வலைப்பதிவை எழுத தொடங்குங்கள்...";

  return (
    <div className="border rounded-lg flex flex-col h-full bg-white">
      <ReactQuill
        theme="snow"
        value={content}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="flex-1 flex flex-col"
      />
    </div>
  );
}
