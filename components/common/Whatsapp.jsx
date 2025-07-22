import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useChatMessage } from '@/context/ChatContext';

const FloatingChatButton = () => {
  const { message, isVisible } = useChatMessage();

  const handleChatClick = () => {
    const phoneNumber = '2348028388185';
    // const phoneNumber = '2349030200031';
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      '_blank'
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
