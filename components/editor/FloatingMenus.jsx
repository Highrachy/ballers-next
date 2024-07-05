import { FloatingMenu, useCurrentEditor } from '@tiptap/react';
import { FormattingButtons, TextStylingButtons } from './EditorButton';

const FloatingMenus = () => {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <FloatingMenu
      className="floating-menu"
      tippyOptions={{ duration: 10000 }}
      editor={editor}
    >
      <FormattingButtons editor={editor} />
    </FloatingMenu>
  );
};

export default FloatingMenus;
