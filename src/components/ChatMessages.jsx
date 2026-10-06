import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createMessage, deleteAdminMessage, findChatMessages } from '../State/Message/Action';
import { findOwnProfile, findUserById } from '../State/User/Action';
import { useRealtime } from '../contexts/RealtimeContext';
import './Dashboard.css';

const normalizeMessages = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.messages)) return data.messages;
  if (Array.isArray(data?.content)) return data.content;
  return [];
};

const mergeMessages = (currentMessages, incomingMessages) => {
  const merged = [...currentMessages];
  const knownIds = new Set(currentMessages
    .map((message) => message.id ?? message.messageId)
    .filter((id) => id != null)
    .map(String));

  incomingMessages.forEach((message) => {
    const id = message.id ?? message.messageId;
    if (id != null && knownIds.has(String(id))) return;
    if (id != null) knownIds.add(String(id));
    merged.push(message);
  });

  return merged;
};

const getSenderId = (message) => (
  message.senderId ?? message.userId ?? message.sender?.id ?? message.sender?.userId ?? message.user?.id ?? message.user?.userId
);

const getUserDisplayName = (user) => {
  const firstName = user?.firstName;
  const lastName = user?.lastName;
  return [firstName, lastName].filter(Boolean).join(' ')
    || user?.name
    || user?.username
    || '';
};

const getSenderName = (message, isOwnMessage, profile, chat, senderNames) => {
  const sender = message.sender ?? message.user ?? {};
  const ownName = getUserDisplayName(profile);
  const receiverName = [chat?.firstName ?? chat?.receiverFirstName, chat?.lastName ?? chat?.receiverLastName].filter(Boolean).join(' ');
  const senderId = getSenderId(message);
  const name = getUserDisplayName(senderNames[String(senderId)])
    || getUserDisplayName(sender)
    || [message.senderFirstName, message.senderLastName].filter(Boolean).join(' ')
    || message.senderName
    || message.userName
    || message.username;

  if (isOwnMessage && ownName) return ownName;
  if (name) return name;
  if (receiverName) return receiverName;

  return message.senderEmail ?? message.userEmail ?? sender.email ?? message.email ?? 'Unknown sender';
};

const getMessageText = (message) => message.content ?? message.text ?? message.messageText ?? message.message ?? '';

function ChatMessages({ adminOnly = false }) {
  const dispatch = useDispatch();
  const { status: realtimeStatus, error: realtimeError, subscribeToMessages } = useRealtime();
  const { chatId } = useParams();
  const location = useLocation();
  const role = String(useSelector((state) => state.auth.role) || localStorage.getItem('role') || '').toUpperCase();
  const isAdmin = role === 'ADMIN';
  const isAdminView = adminOnly && isAdmin;
  const profile = useSelector((state) => state.user.profile);
  const currentUserId = profile?.id ?? profile?.userId;
  const chat = location.state?.chat;
  const [messages, setMessages] = useState([]);
  const [senderNames, setSenderNames] = useState({});
  const requestedSenderIds = useRef(new Set());
  const [draft, setDraft] = useState('');
  const [imageAttachment, setImageAttachment] = useState('');
  const [imageName, setImageName] = useState('');
  const imageInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');

  const loadMessages = useCallback(async ({ showLoading = false } = {}) => {
    if (showLoading) setLoading(true);
    const result = await dispatch(findChatMessages(chatId));
    if (showLoading) setLoading(false);
    if (result.success) {
      setMessages((currentMessages) => mergeMessages(currentMessages, normalizeMessages(result.data)));
      setError('');
      return true;
    }
    setError(result.error || 'Unable to load messages.');
    return false;
  }, [chatId, dispatch]);

  useEffect(() => {
    loadMessages({ showLoading: true });
  }, [loadMessages]);

  useEffect(() => {
    const refreshIfVisible = () => {
      if (document.visibilityState === 'visible') loadMessages();
    };
    const intervalId = window.setInterval(refreshIfVisible, 5000);
    document.addEventListener('visibilitychange', refreshIfVisible);
    window.addEventListener('focus', refreshIfVisible);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', refreshIfVisible);
      window.removeEventListener('focus', refreshIfVisible);
    };
  }, [loadMessages]);

  useEffect(() => {
    if (!adminOnly && !profile) dispatch(findOwnProfile());
  }, [adminOnly, dispatch, profile]);

  useEffect(() => subscribeToMessages((incomingMessage) => {
    const incomingChatId = incomingMessage.chatId ?? incomingMessage.chat?.id;
    if (incomingChatId == null || String(incomingChatId) !== String(chatId)) return;

    setMessages((currentMessages) => {
      const incomingId = incomingMessage.id ?? incomingMessage.messageId;
      const alreadyExists = incomingId != null && currentMessages.some((existingMessage) => {
        const existingId = existingMessage.id ?? existingMessage.messageId;
        return existingId != null && String(incomingId) === String(existingId);
      });
      return alreadyExists ? currentMessages : mergeMessages(currentMessages, [incomingMessage]);
    });
  }), [chatId, subscribeToMessages]);

  useEffect(() => {
    const senderIds = [...new Set(messages.map(getSenderId).filter((id) => id != null).map(String))];
    senderIds.forEach((senderId) => {
      if (requestedSenderIds.current.has(senderId)) return;
      requestedSenderIds.current.add(senderId);
      dispatch(findUserById(senderId)).then((result) => {
        if (!result?.success) return;
        const name = getUserDisplayName(result.data);
        if (name) setSenderNames((current) => ({ ...current, [senderId]: result.data }));
      });
    });
  }, [dispatch, messages]);

  const handleSend = async (event) => {
    event.preventDefault();
    const content = draft.trim();
    if ((!content && !imageAttachment) || adminOnly) return;

    setSending(true);
    setError('');
    const result = await dispatch(createMessage({ content, ...(imageAttachment ? { image: imageAttachment } : {}) }, chatId));
    setSending(false);
    if (!result.success) {
      setError(result.error || 'Unable to send message.');
      return;
    }
    setDraft('');
    setImageAttachment('');
    setImageName('');
    await loadMessages();
  };

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be 5 MB or smaller.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageAttachment(String(reader.result || ''));
      setImageName(file.name);
      setError('');
    };
    reader.onerror = () => setError('Unable to read the selected image.');
    reader.readAsDataURL(file);
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm('Delete this message?')) return;
    setDeletingId(messageId);
    setError('');
    const result = await dispatch(deleteAdminMessage(messageId));
    setDeletingId(null);
    if (!result.success) {
      setError(result.error || 'Unable to delete message.');
      return;
    }
    await loadMessages();
  };

  const backToChats = adminOnly ? '/admin/chats' : '/chats';
  const recipientName = [chat?.firstName ?? chat?.receiverFirstName, chat?.lastName ?? chat?.receiverLastName].filter(Boolean).join(' ');
  const title = recipientName
    ? `Chat with ${recipientName}`
    : chat?.chatName || `Chat ${chatId}`;

  if (adminOnly && !isAdmin) {
    return (
      <main className="dashboard-page users-page">
        <p className="profile-message error-message" role="alert">This page is available to administrators only.</p>
      </main>
    );
  }

  return (
    <main className="dashboard-page messages-page">
      <header className="dashboard-header">
        <Link className="dashboard-brand" to="/dashboard">+</Link>
        <span className="dashboard-label">{title}</span>
        <Link className="dashboard-button dashboard-logout" to={backToChats}>Back to chats</Link>
      </header>

      <section className="messages-panel" aria-label="Chat messages">
        <h1>{title}</h1>
        <p className="messages-connection-status" aria-live="polite">
          {realtimeStatus === 'live' ? 'Live updates connected' : realtimeStatus === 'reconnecting' ? 'Reconnecting to live updates…' : 'Live updates unavailable'}
        </p>
        {realtimeError && <p className="profile-message error-message" role="status">{realtimeError}</p>}
        {(chat?.email || chat?.receiverEmail) && <p className="messages-recipient-email">{chat.email || chat.receiverEmail}</p>}
        {error && <p className="profile-message error-message" role="alert">{error}</p>}

        <div className="messages-list" aria-live="polite">
          {loading ? (
            <p className="profile-message">Loading messages...</p>
          ) : messages.length ? messages.map((message, index) => {
            const messageId = message.id ?? message.messageId ?? index;
            const senderId = getSenderId(message);
            const senderSideId = isAdminView ? chat?.userId1 : currentUserId;
            const senderEmail = message.senderEmail ?? message.userEmail ?? message.sender?.email ?? message.user?.email ?? message.email;
            const isOwnMessage = (senderSideId != null && senderId != null && String(senderId) === String(senderSideId))
              || Boolean(profile?.email && senderEmail && profile.email.toLowerCase() === senderEmail.toLowerCase());
            return (
              <article className={`message-row ${isOwnMessage ? 'message-own' : 'message-received'}`} key={messageId}>
                <div className="message-bubble">
                  <div className="message-meta">
                    <strong>{getSenderName(message, isOwnMessage, profile, chat, senderNames)}</strong>
                    {isAdminView && (message.id != null || message.messageId != null) && (
                      <button
                        type="button"
                        className="table-action delete-action message-delete"
                        onClick={() => handleDelete(message.id ?? message.messageId)}
                        disabled={deletingId === (message.id ?? message.messageId)}
                      >
                        {deletingId === (message.id ?? message.messageId) ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                  </div>
                  <p>{getMessageText(message) || '(Empty message)'}</p>
                  {(message.image || message.imageUrl || message.attachmentUrl) && (
                    <img className="message-image" src={message.image || message.imageUrl || message.attachmentUrl} alt="Message attachment" />
                  )}
                  {(message.createdAt || message.timestamp) && <small>{new Date(message.createdAt ?? message.timestamp).toLocaleString()}</small>}
                </div>
              </article>
            );
          }) : (
            <p className="profile-message">No messages yet. Start the conversation below.</p>
          )}
        </div>

        {!adminOnly && (
          <form className="message-compose" onSubmit={handleSend}>
            <input
              ref={imageInputRef}
              className="message-image-input"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              aria-label="Choose an image to attach"
            />
            <button className="table-action" type="button" onClick={() => imageInputRef.current?.click()} disabled={sending}>
              Add image
            </button>
            {imageAttachment && (
              <div className="message-attachment-preview">
                <img src={imageAttachment} alt={`Selected attachment: ${imageName}`} />
                <button className="table-action delete-action" type="button" onClick={() => { setImageAttachment(''); setImageName(''); }}>
                  Remove image
                </button>
              </div>
            )}
            <textarea
              aria-label="Write a message"
              placeholder="Write a message..."
              rows="2"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength="2000"
            />
            <button className="dashboard-button" type="submit" disabled={sending || (!draft.trim() && !imageAttachment)}>
              {sending ? 'Sending...' : 'Send'}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

export default ChatMessages;
