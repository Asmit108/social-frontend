import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Client } from '@stomp/stompjs';
import { WEBSOCKET_URL } from '../config/apiConfig';

const RealtimeContext = createContext({
  status: 'disconnected',
  error: '',
  subscribeToMessages: () => () => {},
});

export function RealtimeProvider({ children }) {
  const auth = useSelector((state) => state.auth);
  const token = auth.jwt || localStorage.getItem('jwt');
  const role = auth.role || localStorage.getItem('role') || '';
  const messageListeners = useRef(new Set());
  const [status, setStatus] = useState(token ? 'connecting' : 'disconnected');
  const [error, setError] = useState('');

  const subscribeToMessages = useCallback((listener) => {
    messageListeners.current.add(listener);
    return () => messageListeners.current.delete(listener);
  }, []);

  useEffect(() => {
    if (!token) {
      setStatus('disconnected');
      setError('Sign in to enable live chat updates.');
      return undefined;
    }

    setStatus('connecting');
    setError('');

    const client = new Client({
      brokerURL: WEBSOCKET_URL,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
        Role: role,
      },
      reconnectDelay: 15000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        setStatus('live');
        setError('');
        client.subscribe('/user/queue/messages', (frame) => {
          try {
            const message = JSON.parse(frame.body);
            messageListeners.current.forEach((listener) => listener(message));
          } catch (parseError) {
            console.error('Unable to parse a realtime chat message:', parseError);
          }
        });
      },
      onWebSocketClose: (event) => {
        setStatus('reconnecting');
        setError(`WebSocket closed (${event.code}${event.reason ? `: ${event.reason}` : ''}).`);
      },
      onStompError: (frame) => {
        setStatus('disconnected');
        setError(frame.headers.message || frame.body || 'The WebSocket broker rejected the connection.');
      },
      onWebSocketError: () => {
        setStatus('disconnected');
        setError('Could not connect to the WebSocket endpoint. Check the backend /ws handshake.');
      },
    });

    let activated = false;
    const activationTimer = setTimeout(() => {
      activated = true;
      client.activate();
    }, 0);

    return () => {
      clearTimeout(activationTimer);
      if (activated) client.deactivate();
    };
  }, [token, role]);

  const contextValue = useMemo(() => ({ status, error, subscribeToMessages }), [status, error, subscribeToMessages]);
  return <RealtimeContext.Provider value={contextValue}>{children}</RealtimeContext.Provider>;
}

export const useRealtime = () => useContext(RealtimeContext);
