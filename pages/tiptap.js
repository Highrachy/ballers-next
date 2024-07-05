import React from 'react';
import TitleSection from '@/components/common/TitleSection';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import {
  EditorProvider,
  FloatingMenu,
  BubbleMenu,
  useCurrentEditor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaCode,
  FaParagraph,
  FaHeading,
  FaListUl,
  FaListOl,
  FaQuoteRight,
  FaUndo,
  FaRedo,
  FaPaintBrush,
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const extensions = [StarterKit];

const content = `
<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That’s a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
`;

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="d-flex flex-wrap mb-3">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`btn btn-outline-secondary m-1 ${
          editor.isActive('bold') ? 'active' : ''
        }`}
      >
        <FaBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`btn btn-outline-secondary m-1 ${
          editor.isActive('italic') ? 'active' : ''
        }`}
      >
        <FaItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`btn btn-outline-secondary m-1 ${
          editor.isActive('strike') ? 'active' : ''
        }`}
      >
        <FaStrikethrough />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={`btn btn-outline-secondary m-1 ${
          editor.isActive('code') ? 'active' : ''
        }`}
      >
        <FaCode />
      </button>
      <button
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        className="btn btn-outline-danger m-1"
      >
        Clear marks
      </button>
      <button
        onClick={() => editor.chain().focus().clearNodes().run()}
        className="btn btn-outline-danger m-1"
      >
        Clear nodes
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`btn btn-outline-secondary m-1 ${
          editor.isActive('paragraph') ? 'active' : ''
        }`}
      >
        <FaParagraph />
      </button>
      {[1, 2, 3].map((level) => (
        <button
          key={level}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          className={`btn btn-outline-secondary m-1 ${
            editor.isActive('heading', { level }) ? 'active' : ''
          }`}
        >
          <FaHeading /> {`H${level}`}
        </button>
      ))}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`btn btn-outline-secondary m-1 ${
          editor.isActive('bulletList') ? 'active' : ''
        }`}
      >
        <FaListUl />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`btn btn-outline-secondary m-1 ${
          editor.isActive('orderedList') ? 'active' : ''
        }`}
      >
        <FaListOl />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`btn btn-outline-secondary m-1 ${
          editor.isActive('blockquote') ? 'active' : ''
        }`}
      >
        <FaQuoteRight />
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="btn btn-outline-secondary m-1"
      >
        Horizontal rule
      </button>
      <button
        onClick={() => editor.chain().focus().setHardBreak().run()}
        className="btn btn-outline-secondary m-1"
      >
        Hard break
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="btn btn-outline-secondary m-1"
      >
        <FaUndo />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="btn btn-outline-secondary m-1"
      >
        <FaRedo />
      </button>
      <button
        onClick={() => editor.chain().focus().setColor('#958DF1').run()}
        className={`btn btn-outline-secondary m-1 ${
          editor.isActive('textStyle', { color: '#958DF1' }) ? 'active' : ''
        }`}
      >
        <FaPaintBrush />
      </button>
    </div>
  );
};

const Tiptap = () => {
  return (
    <>
      <Header />
      <TitleSection
        name="About BALL"
        content="The only realistic burden free process of owning your ideal home."
      />
      <div className="container-fluid mb-7">
        <EditorProvider
          slotBefore={<MenuBar />}
          extensions={extensions}
          content={content}
        >
          <InnerMenus />
          <EditorJSONPreview />
        </EditorProvider>
      </div>
      <Footer />
    </>
  );
};

const EditorJSONPreview = () => {
  const { editor } = useCurrentEditor();

  return <pre>{JSON.stringify(editor?.getJSON(), null, 2)}</pre>;
};

const InnerMenus = () => {
  const { editor } = useCurrentEditor();

  return (
    <>
      {editor && (
        <BubbleMenu
          className="bubble-menu"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`btn btn-outline-secondary m-1 ${
              editor.isActive('bold') ? 'active' : ''
            }`}
          >
            <FaBold />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`btn btn-outline-secondary m-1 ${
              editor.isActive('italic') ? 'active' : ''
            }`}
          >
            <FaItalic />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`btn btn-outline-secondary m-1 ${
              editor.isActive('strike') ? 'active' : ''
            }`}
          >
            <FaStrikethrough />
          </button>
        </BubbleMenu>
      )}

      {editor && (
        <FloatingMenu
          className="floating-menu"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`btn btn-outline-secondary m-1 ${
              editor.isActive('heading', { level: 1 }) ? 'active' : ''
            }`}
          >
            <FaHeading /> H1
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`btn btn-outline-secondary m-1 ${
              editor.isActive('heading', { level: 2 }) ? 'active' : ''
            }`}
          >
            <FaHeading /> H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`btn btn-outline-secondary m-1 ${
              editor.isActive('bulletList') ? 'active' : ''
            }`}
          >
            <FaListUl />
          </button>
        </FloatingMenu>
      )}
    </>
  );
};

export default Tiptap;
