import React from 'react';
import PropTypes from 'prop-types';
import { EditorProvider } from '@tiptap/react';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import MenuBar from './MenuBar';
import BubbleMenus from './BubbleMenus';
import FloatingMenus from './FloatingMenus';
import { EDITOR_MENU } from '@/utils/constants';

// Tiptap extensions
const getExtensions = ({ placeholder }) => [
  StarterKit,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Highlight,
  Link.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: 'https',
  }),
  Placeholder.configure({
    // Use a placeholder:
    placeholder,
    // Use different placeholders depending on the node type:
    // placeholder: ({ node }) => {
    //   if (node.type.name === 'heading') {
    //     return 'What’s the title?'
    //   }

    //   return 'Can you add some further context?'
    // },
  }),
];

const TipTapEditor = ({
  menuType,
  placeholder,
  value,
  onUpdate,
  showMenuBar,
  showBubbleMenu,
  showFloatingMenu,
}) => {
  const initial = ` <p>
          Wow, this editor has support for links to the whole <a href="https://en.wikipedia.org/wiki/World_Wide_Web">World Wide Web</a>. We tested a lot of URLs and I think you can add *every URL* you want. Isn’t that cool? Let’s try <a href="https://statamic.com/">another one!</a> Yep, seems to work.
        </p>
        <p>
          By default every link will get a <code>rel="noopener noreferrer nofollow"</code> attribute. It’s configurable though.
        </p>`;
  return (
    <EditorProvider
      className="tiptap-editor"
      slotBefore={showMenuBar ? <MenuBar menuType={menuType} /> : null}
      extensions={getExtensions({ placeholder })}
      content={value || initial}
      onUpdate={onUpdate}
    >
      {showBubbleMenu && <BubbleMenus menuType={menuType} />}
      {showFloatingMenu && <FloatingMenus />}
    </EditorProvider>
  );
};

TipTapEditor.defaultProps = {
  menuType: EDITOR_MENU.LITE,
  onUpdate: () => {},
  placeholder: null,
  showMenuBar: true,
  showBubbleMenu: true,
  showFloatingMenu: false,
  value: '',
};

TipTapEditor.propTypes = {
  menuType: PropTypes.oneOf(Object.values(EDITOR_MENU)),
  onUpdate: PropTypes.func,
  placeholder: PropTypes.string,
  showMenuBar: PropTypes.bool,
  showBubbleMenu: PropTypes.bool,
  showFloatingMenu: PropTypes.bool,
  value: PropTypes.string,
};

export default TipTapEditor;
