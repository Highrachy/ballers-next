import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useChatMessage } from '@/context/ChatContext';

const FloatingChatButton = () => {
  const { message, isVisible } = useChatMessage();

  const handleChatClick = () => {
    // 🎯 CLARITY: WHATSAPP CLICK (HIGH INTENT)
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('event', 'whatsapp_chat_click');

      // Optional segmentation (very useful)
      window.clarity('set', 'chatMessageLength', message?.length || 0);
      window.clarity('set', 'hasPrefilledMessage', !!message);
    }

    // const phoneNumber = '2348028388185';
    const phoneNumber = '2349030200031';

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      '_blank',
    );
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="floating-chat-button" onClick={handleChatClick}>
      <FaWhatsapp size={40} />
    </div>
  );
};

export default FloatingChatButton;
