import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Heading from "@tiptap/extension-heading";
import { useCallback, useState } from "react";
import {
  Bold, Italic, Underline as UnderlineIcon,
  Heading1, Heading2, Heading3,
  List, ListOrdered,
  Code, Image as ImageIcon,
  Type, PaintBucket,
  AlignLeft, AlignCenter, AlignRight,
  Paperclip, Link
} from "lucide-react";

export default function RichEditor({ value, onChange }) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      return data.url;
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const editor = useEditor({
    autofocus: true,
    content: value || "<p>Start typing here...</p>",
    extensions: [
      StarterKit.configure({
        bulletList: true,
        orderedList: true,
        codeBlock: true,
        blockquote: true,
        horizontalRule: true,
      }),
      Underline,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Heading.configure({ levels: [1, 2, 3] }),
    ],
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-[300px] p-4",
      },
    },
  });

  const handleImageUpload = useCallback(async () => {
    if (!editor) return;
    
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      if (!input.files?.[0]) return;
      
      const url = await uploadImage(input.files[0]);
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    };
    input.click();
  }, [editor]);

  const addLink = useCallback(() => {
    if (!editor) return;
    
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-300 shadow-sm">
        <div className="animate-pulse p-4 min-h-[400px]"></div>
      </div>
    );
  }

  const ToolbarButton = ({ onClick, active, disabled, children, title }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        p-2 rounded-md transition-all duration-200
        ${active 
          ? "bg-blue-100 text-blue-600 border border-blue-200" 
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        flex items-center justify-center
      `}
    >
      {children}
    </button>
  );

  const ToolbarSeparator = () => (
    <div className="w-px h-6 bg-gray-300 mx-1"></div>
  );

  return (
    <div className="w-full mx-auto bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
      {/* --- TOP TOOLBAR --- */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b bg-gray-50">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 mr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold (Ctrl+B)"
          >
            <Bold size={18} />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic (Ctrl+I)"
          >
            <Italic size={18} />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon size={18} />
          </ToolbarButton>
        </div>

        <ToolbarSeparator />

        {/* Headings */}
        <div className="flex items-center gap-1 mr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
            active={editor.isActive("heading", { level: 1 })}
            title="Heading 1"
          >
            <div className="flex items-center gap-1">
              <Heading1 size={18} />
              <span className="text-xs font-bold">1</span>
            </div>
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
            active={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <div className="flex items-center gap-1">
              <Heading2 size={18} />
              <span className="text-xs font-bold">2</span>
            </div>
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().setHeading({ level: 3 }).run()}
            active={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            <div className="flex items-center gap-1">
              <Heading3 size={18} />
              <span className="text-xs font-bold">3</span>
            </div>
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            active={editor.isActive("paragraph")}
            title="Normal Text"
          >
            <Type size={18} />
          </ToolbarButton>
        </div>

        <ToolbarSeparator />

        {/* Lists */}
        <div className="flex items-center gap-1 mr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <List size={18} />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Numbered List"
          >
            <ListOrdered size={18} />
          </ToolbarButton>
        </div>

        <ToolbarSeparator />

        {/* More Formatting */}
        <div className="flex items-center gap-1 mr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive("codeBlock")}
            title="Code Block"
          >
            <Code size={18} />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            title="Quote"
          >
            <div className="text-lg font-serif">"</div>
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Line"
          >
            <div className="w-6 h-px bg-gray-700"></div>
          </ToolbarButton>
        </div>

        <ToolbarSeparator />

        {/* Media & Links */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={handleImageUpload}
            disabled={isUploading}
            title="Insert Image"
          >
            <div className="flex items-center gap-1">
              <ImageIcon size={18} />
              {isUploading && (
                <span className="text-xs text-gray-500">Uploading...</span>
              )}
            </div>
          </ToolbarButton>
          
          <ToolbarButton
            onClick={addLink}
            title="Insert Link"
          >
            <Link size={18} />
          </ToolbarButton>
        </div>

        <div className="flex-1"></div>

        {/* Word Count */}
        <div className="text-xs text-gray-500 px-2">
          {editor.storage.characterCount?.characters() || 0} characters
        </div>
      </div>

      {/* --- EDITOR CONTENT --- */}
      <div className="relative">
        <EditorContent 
          editor={editor} 
          className="min-h-[400px] p-6 focus:outline-none"
        />
        
        {/* Placeholder when empty */}
        {!editor.getText() && (
          <div className="absolute top-6 left-6 text-gray-400 pointer-events-none">
            Start writing your note here... Try typing / for commands
          </div>
        )}
      </div>

      {/* --- BOTTOM STATUS BAR --- */}
      <div className="flex items-center justify-between px-4 py-2 border-t bg-gray-50 text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Format:</span>
            <span className="px-2 py-1 bg-white border rounded">
              {editor.isActive("heading", { level: 1 }) && "Heading 1"}
              {editor.isActive("heading", { level: 2 }) && "Heading 2"}
              {editor.isActive("heading", { level: 3 }) && "Heading 3"}
              {editor.isActive("paragraph") && "Paragraph"}
              {editor.isActive("bulletList") && "Bullet List"}
              {editor.isActive("orderedList") && "Numbered List"}
              {editor.isActive("codeBlock") && "Code Block"}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium">Styles:</span>
            <div className="flex gap-1">
              {editor.isActive("bold") && (
                <span className="px-2 py-1 bg-white border rounded">Bold</span>
              )}
              {editor.isActive("italic") && (
                <span className="px-2 py-1 bg-white border rounded">Italic</span>
              )}
              {editor.isActive("underline") && (
                <span className="px-2 py-1 bg-white border rounded">Underline</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-xs">
          {editor.storage.characterCount?.words() || 0} words
        </div>
      </div>
    </div>
  );
}