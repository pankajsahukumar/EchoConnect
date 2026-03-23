import React from 'react';

import { styled } from '@mui/material/styles';

const StyledText = styled('span')({
  '& a': {
    color: '#039be5',
    textDecoration: 'underline',
  },
  '& strong': {
    fontWeight: 600,
  },
  '& em': {
    fontStyle: 'italic',
  },
  '& del': {
    textDecoration: 'line-through',
  },
  '& pre': {
    fontFamily: 'monospace',
    backgroundColor: '#f0f2f5',
    padding: '4px 8px',
    borderRadius: '4px',
    margin: '4px 0',
    display: 'inline-block',
  },
});

const TextComponent = ({ text }) => {
  // Parse WhatsApp formatting
  const parseWhatsAppText = (text) => {
    let formattedText = text;
    
    // Replace URLs with anchor tags
    formattedText = formattedText.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Bold text (*text*)
    formattedText = formattedText.replace(/\*(.*?)\*/g, '<strong>$1</strong>');

    // Italic text (_text_)
    formattedText = formattedText.replace(/_(.*?)_/g, '<em>$1</em>');

    // Strikethrough text (~text~)
    formattedText = formattedText.replace(/~(.*?)~/g, '<del>$1</del>');

    // Monospace text (```text```)
    formattedText = formattedText.replace(/```(.*?)```/g, '<pre>$1</pre>');

    // Replace newlines with <br/>
    formattedText = formattedText.replace(/\n/g, '<br/>');

    return formattedText;
  };

  return <StyledText dangerouslySetInnerHTML={{ __html: parseWhatsAppText(text) }} />;
};
export default TextComponent;