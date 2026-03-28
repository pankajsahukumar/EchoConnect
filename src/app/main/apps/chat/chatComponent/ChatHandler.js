import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useSocket from 'src/hooks/useSocket';
import useCurrentChat from 'src/hooks/useCurrentChat';
import {
  addNewMessage,
  loadMoreMessages,
  selectChatHasMore,
  selectChatCursor,
} from '../store/chatSlice';
import RenderMessage from '../chat/components/Messages/RenderMessage';

// ─── Date separator helpers ─────────────────────────────────────────────────

function getDateLabel(timestamp) {
  if (!timestamp) return null;
  const d = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp);
  if (Number.isNaN(d.getTime())) return null;

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const same = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (same(d, today)) return 'Today';
  if (same(d, yesterday)) return 'Yesterday';
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

function DateSeparator({ label }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
      <span
        style={{
          backgroundColor: 'rgba(255,255,255,0.12)',
          color: '#e9edef',
          fontSize: 12,
          fontWeight: 500,
          borderRadius: 8,
          padding: '4px 12px',
          userSelect: 'none',
        }}
      >
        {label}
      </span>
    </div>
  );
}

function getQuotePreview(msg) {
  if (!msg) return 'Message';
  const mt = msg.messageType || msg.message?.messageType;
  switch (mt) {
    case 'text':
      return msg.text || msg.message?.text || 'Text message';
    case 'template': {
      const t = msg.templateMessage || msg.message?.templateMessage;
      return t?.body?.data?.[0]?.text || t?.body?.text || 'Template message';
    }
    case 'interactive':
      return (
        msg.interactiveMessage?.body?.text ||
        msg.message?.interactiveMessage?.body?.text ||
        'Interactive message'
      );
    case 'image':
      return 'Photo';
    case 'video':
      return 'Video';
    case 'document':
      return msg.fileName || msg.message?.fileName || 'Document';
    default:
      return 'Message';
  }
}

// ─── Component ──────────────────────────────────────────────────────────────

const ChatHandler = () => {
  const { socket } = useSocket('/chats');
  const dispatch = useDispatch();

  const scrollbarRef = useRef(null);
  const bottomRef = useRef(null);
  const isLoadingMore = useRef(false);
  const prevScrollHeight = useRef(null);

  const { chat, id } = useCurrentChat();
  const hasMore = useSelector(selectChatHasMore);
  const nextCursor = useSelector(selectChatCursor);

  const [highlightedMessageId, setHighlightedMessageId] = useState(null);

  // Keep a ref of latest values so the scroll handler is never stale
  const latestRef = useRef({ hasMore, id, nextCursor });
  useEffect(() => {
    latestRef.current = { hasMore, id, nextCursor };
  }, [hasMore, id, nextCursor]);

  // ── Socket room ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    socket.emit('join_conversation', { chatId: id });
    return () => socket.emit('leave_conversation', { chatId: id });
  }, [socket, id]);

  useEffect(() => {
    const handler = (message) => dispatch(addNewMessage(message));
    socket.on('chatMessage', handler);
    return () => socket.off('chatMessage', handler);
  }, [socket, dispatch]);

  // ── Infinite scroll (top of list → load older messages) ───────────────────
  useEffect(() => {
    let el = scrollbarRef.current;
    let cleanup = () => {};

    const attach = (element) => {
      const onScroll = () => {
        if (element.scrollTop > 80) return;
        const { hasMore, id: chatId, nextCursor: cursor } = latestRef.current;
        if (!hasMore || isLoadingMore.current || !chatId || !cursor) return;
        isLoadingMore.current = true;
        prevScrollHeight.current = element.scrollHeight;
        dispatch(loadMoreMessages({ chatId, cursor })).then((result) => {
          if (loadMoreMessages.rejected.match(result)) {
            isLoadingMore.current = false;
            prevScrollHeight.current = null;
          }
        });
      };
      element.addEventListener('scroll', onScroll);
      return () => element.removeEventListener('scroll', onScroll);
    };

    if (el) {
      cleanup = attach(el);
    } else {
      const raf = requestAnimationFrame(() => {
        el = scrollbarRef.current;
        if (el) cleanup = attach(el);
      });
      return () => cancelAnimationFrame(raf);
    }
    return () => cleanup();
  }, [dispatch]);

  // ── Scroll position: restore after prepend, else stick to bottom ──────────
  useEffect(() => {
    const el = scrollbarRef.current;
    if (!el || !chat.length) return;

    if (prevScrollHeight.current !== null) {
      el.scrollTop = el.scrollHeight - prevScrollHeight.current;
      prevScrollHeight.current = null;
      isLoadingMore.current = false;
      return;
    }

    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (isNearBottom || chat.length <= 30) {
      bottomRef.current?.scrollIntoView({ behavior: 'auto' });
    }
  }, [chat]);

  // ── Build items list with date separators ─────────────────────────────────
  const items = [];
  let lastDateStr = null;

  chat.forEach((msg) => {
    const ts = msg.messageTime || msg.dateCreated || msg.statusTimestamp || msg.createdAt;
    const label = getDateLabel(ts);
    const dateStr = ts ? new Date(typeof ts === 'number' ? ts : ts).toDateString() : null;
    if (label && dateStr !== lastDateStr) {
      items.push({ type: 'separator', label, key: `sep-${dateStr}` });
      lastDateStr = dateStr;
    }
    items.push({ type: 'message', msg });
  });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-auto h-full min-h-0 w-full">
      <div className="flex flex-1 z-10 flex-col relative">
        <FuseScrollbars
          ref={scrollbarRef}
          className="flex flex-1 flex-col overflow-y-auto"
          option={{ suppressScrollX: true, wheelPropagation: true }}
          style={{
            backgroundColor: '#0b141a',
            backgroundImage:
              'url("data:image/svg+xml,%3csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cdefs%3e%3cpattern id=\'a\' patternUnits=\'userSpaceOnUse\' width=\'20\' height=\'20\' patternTransform=\'scale(0.5) rotate(0)\'%3e%3crect x=\'0\' y=\'0\' width=\'100%25\' height=\'100%25\' fill=\'hsla(0,0%25,100%25,0)\'/%3e%3cpath d=\'M 10,-2.55e-7 V 20 Z M -1.1677362e-8,10 H 20 Z\' stroke-width=\'0.5\' stroke=\'hsla(0,0%25,100%25,0.04)\' fill=\'none\'/%3e%3c/pattern%3e%3c/defs%3e%3crect width=\'800%25\' height=\'800%25\' transform=\'translate(0,0)\' fill=\'url(%23a)\'/%3e%3c/svg%3e")',
          }}
        >
          {items.map((item, idx) => {
            if (item.type === 'separator') {
              return <DateSeparator key={item.key} label={item.label} />;
            }

            const { msg } = item;
            const messageType = msg.message?.messageType;
            // Use messageOriginType (covers SYSTEM) with senderType as fallback
            const origin = msg.messageOriginType || msg.senderType;
            const isMine = origin === 'USER';

            // Show tail on first message of a sender group (after separator or sender switch)
            const prevItem = items[idx - 1];
            const showTail =
              !prevItem ||
              prevItem.type === 'separator' ||
              (prevItem.type === 'message' &&
                (prevItem.msg.messageOriginType || prevItem.msg.senderType) !== origin);

            // Build quoted-reply reference
            let quote = null;
            if (msg.replyMessage) {
              const rm = msg.replyMessage;
              quote = {
                id: msg.replyMessageId,
                type: rm.messageType || rm.message?.messageType || 'text',
                preview: getQuotePreview(rm),
                authorName:
                  rm.messageOriginType === 'USER' || rm.senderType === 'USER'
                    ? 'You'
                    : rm.senderUser?.name || 'Contact',
              };
            }

            return (
              <RenderMessage
                key={msg.id || msg.messageId}
                message={msg.message}
                messageType={messageType}
                messageOriginType={origin}
                isMine={isMine}
                showTail={showTail}
                senderName={!isMine && origin !== 'SYSTEM' ? msg.senderUser?.name || 'Contact' : ''}
                messageId={msg.id || msg.messageId}
                quote={quote}
                highlightedMessageId={highlightedMessageId}
                setHighlightedMessageId={setHighlightedMessageId}
                onReply={() => {}}
                onCopy={() => {}}
                onForward={() => {}}
                onDelete={() => {}}
                onEmojiSelect={() => {}}
                onQuoteClick={() => {}}
                Data={msg}
              />
            );
          })}
          <div ref={bottomRef} style={{ marginTop: 10 }} />
        </FuseScrollbars>
      </div>
    </div>
  );
};

export default ChatHandler;
