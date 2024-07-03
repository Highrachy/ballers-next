import React from 'react';
import PropTypes from 'prop-types';
import { Field, getIn } from 'formik';
import { connect } from 'formik';
import classNames from 'classnames';
import {
  getValidityClass,
  FeedbackMessage,
  feedback,
} from 'components/forms/form-helper';
import Label from './Label';
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

// Tiptap extensions
const extensions = [StarterKit];

// Tiptap Editor Content
const initialContent = `
<h2>Hi there,</h2>
<p>This is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kinds of basic text styles you’d probably expect from a text editor. But wait until you see the lists:</p>
<ul>
  <li>That’s a bullet list with one …</li>
  <li>… or two list items.</li>
</ul>
<p>Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:</p>
<pre><code class="language-css">body { display: none; }</code></pre>
<p>I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.</p>
<blockquote>Wow, that’s amazing. Good work, boy! 👏<br />— Mom</blockquote>
`;

// Custom Formik Input for TipTap
const TipTapInput = ({
  formGroupClassName,
  formik,
  helpText,
  inputClassName,
  isValidMessage,
  label,
  labelLink,
  labelClassName,
  name,
  optional,
  placeholder,
  showFeedback,
  tooltipHeader,
  tooltipText,
  tooltipPosition,
  showMenuBar,
  showBubbleMenu,
  showFloatingMenu,
  ...props
}) => {
  return (
    <div className={classNames(formGroupClassName, 'mb-4')}>
      <Label
        className={labelClassName}
        labelLink={labelLink}
        name={name}
        optional={optional}
        text={label}
        tooltipPosition={tooltipPosition}
        tooltipText={tooltipText}
      />
      <Field name={name}>
        {({ field, form }) => {
          const value = getIn(formik.values, name) || initialContent;
          return (
            <>
              <div
                {...props}
                className={classNames(
                  'editor-container form-control p-0',
                  inputClassName,
                  getValidityClass(formik, name, showFeedback)
                )}
                id={name}
                name={name}
                placeholder={placeholder || label}
              >
                <EditorProvider
                  slotBefore={showMenuBar && <MenuBar />}
                  extensions={extensions}
                  content={value}
                  onUpdate={({ editor }) =>
                    form.setFieldValue(name, editor.getHTML())
                  }
                >
                  {showBubbleMenu && <BubbleMenus />}
                  {showFloatingMenu && <FloatingMenus />}
                </EditorProvider>
              </div>
              <FeedbackMessage
                formik={formik}
                helpText={helpText}
                name={name}
                showFeedback={showFeedback}
                validMessage={isValidMessage}
              />
            </>
          );
        }}
      </Field>
    </div>
  );
};

// PropTypes and defaultProps for TipTapInput
TipTapInput.defaultProps = {
  formGroupClassName: 'form-group mb-4',
  helpText: null,
  inputClassName: null,
  isValidMessage: '',
  label: null,
  labelClassName: null,
  labelLink: null,
  optional: false,
  placeholder: null,
  showFeedback: feedback.ALL,
  tooltipHeader: null,
  tooltipPosition: 'right',
  tooltipText: null,
  showMenuBar: true,
  showBubbleMenu: false,
  showFloatingMenu: false,
};

TipTapInput.propTypes = {
  formGroupClassName: PropTypes.string,
  formik: PropTypes.object.isRequired,
  helpText: PropTypes.string,
  inputClassName: PropTypes.string,
  isValidMessage: PropTypes.string,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  labelLink: PropTypes.shape({
    to: PropTypes.string,
    text: PropTypes.string,
    onClick: PropTypes.func,
  }),
  name: PropTypes.string.isRequired,
  optional: PropTypes.bool,
  placeholder: PropTypes.string,
  showFeedback: PropTypes.oneOf(Object.keys(feedback)),
  tooltipHeader: PropTypes.string,
  tooltipPosition: PropTypes.string,
  tooltipText: PropTypes.string,
  showMenuBar: PropTypes.bool,
  showBubbleMenu: PropTypes.bool,
  showFloatingMenu: PropTypes.bool,
};

export default connect(TipTapInput);

const EditorButton = ({
  onClick,
  disabled,
  isActive,
  icon: Icon,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-outline-secondary ${isActive ? 'active' : ''}`}
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
};

EditorButton.defaultProps = {
  onClick: () => {},
  disabled: false,
  isActive: false,
};

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="menu-bar d-flex flex-wrap mb-3">
      <EditorButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        icon={FaBold}
        isActive={editor.isActive('bold')}
      />
      <EditorButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        icon={FaItalic}
        isActive={editor.isActive('italic')}
      />
      <EditorButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        icon={FaStrikethrough}
        isActive={editor.isActive('strike')}
      />
      <EditorButton
        onClick={() => editor.chain().focus().setParagraph().run()}
        disabled={!editor.can().chain().focus().setParagraph().run()}
        icon={FaParagraph}
        isActive={editor.isActive('paragraph')}
      />
      {[1, 2, 3].map((level) => (
        <EditorButton
          key={level}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          icon={FaHeading}
          isActive={editor.isActive('heading', { level })}
        >
          H{level}
        </EditorButton>
      ))}
      <EditorButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        icon={FaListUl}
        isActive={editor.isActive('bulletList')}
      />
      <EditorButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        icon={FaListOl}
        isActive={editor.isActive('orderedList')}
      />
      <EditorButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        disabled={!editor.can().chain().focus().toggleBlockquote().run()}
        icon={FaQuoteRight}
        isActive={editor.isActive('blockquote')}
      />
      <EditorButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        icon={FaCode}
      />
      <EditorButton
        onClick={() => editor.chain().focus().undo().run()}
        icon={FaUndo}
      />
      <EditorButton
        onClick={() => editor.chain().focus().redo().run()}
        icon={FaRedo}
      />
    </div>
  );
};

const FloatingMenus = () => {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <FloatingMenu
      className="floating-menu"
      tippyOptions={{ duration: 100 }}
      editor={editor}
    >
      {[1, 2].map((level) => (
        <EditorButton
          key={level}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          disabled={
            !editor.can().chain().focus().toggleHeading({ level }).run()
          }
          icon={FaHeading}
          isActive={editor.isActive('heading', { level })}
        >
          H{level}
        </EditorButton>
      ))}
      <EditorButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        icon={FaListUl}
        isActive={editor.isActive('bulletList')}
      />
    </FloatingMenu>
  );
};
const BubbleMenus = () => {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <BubbleMenu
      className="bubble-menu"
      tippyOptions={{ duration: 100 }}
      editor={editor}
    >
      <EditorButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        icon={FaBold}
        isActive={editor.isActive('bold')}
      />
      <EditorButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        icon={FaItalic}
        isActive={editor.isActive('italic')}
      />
      <EditorButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        icon={FaStrikethrough}
        isActive={editor.isActive('strike')}
      />
    </BubbleMenu>
  );
};
