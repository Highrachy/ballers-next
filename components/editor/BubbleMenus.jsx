import { BubbleMenu, useCurrentEditor } from '@tiptap/react';
import { LinkButtons, TextStylingButtons } from './EditorButton';
import { EDITOR_MENU } from '@/utils/constants';
import { Line } from '@react-pdf/renderer';

const BubbleMenus = ({ menuType }) => {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <BubbleMenu
      className="bubble-menu"
      tippyOptions={{ duration: 100 }}
      editor={editor}
    >
      <TextStylingButtons editor={editor} />
      {(menuType === EDITOR_MENU.NORMAL || menuType === EDITOR_MENU.FULL) && (
        <LinkButtons editor={editor} />
      )}
    </BubbleMenu>
  );
};

export default BubbleMenus;
