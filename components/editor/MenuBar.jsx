import { useCurrentEditor } from '@tiptap/react';
import {
  AlignmentButtons,
  FormattingButtons,
  HistoryButtons,
  ListButtons,
  LinkButtons,
  TextStylingButtons,
} from './EditorButton';
import { EDITOR_MENU } from '@/utils/constants';

const MenuBar = ({ menuType }) => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  let buttonsToRender;

  switch (menuType) {
    case EDITOR_MENU.LITE:
      buttonsToRender = (
        <>
          <TextStylingButtons editor={editor} />
        </>
      );
      break;
    case EDITOR_MENU.COMPACT:
      buttonsToRender = (
        <>
          <TextStylingButtons editor={editor} />
          <FormattingButtons editor={editor} />
          <HistoryButtons editor={editor} />
        </>
      );
      break;
    case EDITOR_MENU.NORMAL:
      buttonsToRender = (
        <>
          <TextStylingButtons editor={editor} />
          <FormattingButtons editor={editor} />
          <LinkButtons editor={editor} />
          <HistoryButtons editor={editor} />
        </>
      );
      break;
    case EDITOR_MENU.FULL:
      buttonsToRender = (
        <>
          <TextStylingButtons editor={editor} />
          <FormattingButtons editor={editor} />
          <LinkButtons editor={editor} />
          <ListButtons editor={editor} />
          <AlignmentButtons editor={editor} />
          <HistoryButtons editor={editor} />
        </>
      );
      break;
    default:
      buttonsToRender = null;
  }

  return <div className="menu-bar d-flex flex-wrap">{buttonsToRender}</div>;
};

export default MenuBar;
