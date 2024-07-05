import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaHeading,
  FaListUl,
  FaListOl,
  FaQuoteRight,
  FaUndo,
  FaRedo,
  FaParagraph,
  FaHighlighter,
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaRegWindowMinimize,
  FaLink,
  FaUnlink,
} from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useCallback } from 'react';

const EditorButton = ({
  onClick,
  disabled,
  isActive,
  icon: Icon,
  title,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-tiptap ${isActive ? 'active' : ''}`}
      aria-pressed={isActive}
      tabIndex="0"
      title={title}
      {...props}
    >
      <Icon />
    </button>
  );
};

EditorButton.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  isActive: PropTypes.bool,
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
};

EditorButton.defaultProps = {
  onClick: () => {},
  disabled: false,
  isActive: false,
};

export default EditorButton;

export const TextStylingButtons = ({ editor }) => (
  <div className="button-group">
    <EditorButton
      onClick={() => editor.chain().focus().toggleBold().run()}
      disabled={!editor.can().chain().focus().toggleBold().run()}
      icon={FaBold}
      isActive={editor.isActive('bold')}
      title="Bold (Ctrl+B)"
    />
    <EditorButton
      onClick={() => editor.chain().focus().toggleItalic().run()}
      disabled={!editor.can().chain().focus().toggleItalic().run()}
      icon={FaItalic}
      isActive={editor.isActive('italic')}
      title="Italic (Ctrl+I)"
    />
    <EditorButton
      onClick={() => editor.chain().focus().toggleStrike().run()}
      disabled={!editor.can().chain().focus().toggleStrike().run()}
      icon={FaStrikethrough}
      isActive={editor.isActive('strike')}
      title="Strikethrough (Ctrl+Shift+S)"
    />
  </div>
);

export const LinkButtons = ({ editor }) => {
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();

      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="button-group">
      <EditorButton
        onClick={setLink}
        isActive={editor.isActive('link')}
        icon={FaLink}
        title="Strikethrough (Ctrl+Shift+S)"
      />
      <EditorButton
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive('link')}
        icon={FaUnlink}
        title="Unlink"
      />
    </div>
  );
};

export const FormattingButtons = ({ editor }) => (
  <div className="button-group">
    <EditorButton
      onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      icon={FaHeading}
      isActive={editor.isActive('heading', { level: 3 })}
      title="Heading 3"
    />
    <EditorButton
      onClick={() => {
        editor.chain().focus().unsetAllMarks().run();
        editor.chain().focus().clearNodes().run();
      }}
      icon={FaParagraph}
      title="Paragraph"
    />
    <EditorButton
      onClick={() => editor.chain().focus().toggleBlockquote().run()}
      disabled={!editor.can().chain().focus().toggleBlockquote().run()}
      icon={FaQuoteRight}
      isActive={editor.isActive('blockquote')}
      title="Blockquote"
    />
    <EditorButton
      onClick={() => editor.chain().focus().setHorizontalRule().run()}
      icon={FaRegWindowMinimize}
      title="Horizontal Rule"
    />
    <EditorButton
      onClick={() => editor.chain().focus().toggleHighlight().run()}
      isActive={editor.isActive('highlight')}
      icon={FaHighlighter}
      title="Highlight"
    />
  </div>
);

export const ListButtons = ({ editor }) => (
  <div className="button-group">
    <EditorButton
      onClick={() => editor.chain().focus().toggleBulletList().run()}
      disabled={!editor.can().chain().focus().toggleBulletList().run()}
      icon={FaListUl}
      isActive={editor.isActive('bulletList')}
      title="Bullet List"
    />
    <EditorButton
      onClick={() => editor.chain().focus().toggleOrderedList().run()}
      disabled={!editor.can().chain().focus().toggleOrderedList().run()}
      icon={FaListOl}
      isActive={editor.isActive('orderedList')}
      title="Ordered List"
    />
  </div>
);

export const AlignmentButtons = ({ editor }) => (
  <div className="button-group">
    <EditorButton
      onClick={() => editor.chain().focus().setTextAlign('left').run()}
      isActive={editor.isActive({ textAlign: 'left' })}
      icon={FaAlignLeft}
      title="Align Left"
    />
    <EditorButton
      onClick={() => editor.chain().focus().setTextAlign('center').run()}
      isActive={editor.isActive({ textAlign: 'center' })}
      icon={FaAlignCenter}
      title="Align Center"
    />
    <EditorButton
      onClick={() => editor.chain().focus().setTextAlign('right').run()}
      isActive={editor.isActive({ textAlign: 'right' })}
      icon={FaAlignRight}
      title="Align Right"
    />
    {/* <EditorButton
  onClick={() => editor.chain().focus().setTextAlign('justify').run()}
  isActive={editor.isActive({ textAlign: 'justify' })}
  icon={FaAlignJustify}
  title="Justify"
/> */}
  </div>
);

export const HistoryButtons = ({ editor }) => (
  <div className="button-group">
    <EditorButton
      onClick={() => editor.chain().focus().undo().run()}
      icon={FaUndo}
      title="Undo (Ctrl+Z)"
    />
    <EditorButton
      onClick={() => editor.chain().focus().redo().run()}
      icon={FaRedo}
      title="Redo (Ctrl+Y)"
    />
  </div>
);
