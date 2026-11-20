import { useEffect, useRef, useState } from 'react';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
const GSI_SRC = 'https://accounts.google.com/gsi/client';

// Tipado mínimo de Google Identity Services (token client)
interface TokenResponse { access_token?: string; error?: string }
interface TokenClient { requestAccessToken: () => void }
declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (resp: TokenResponse) => void;
          }) => TokenClient;
        };
      };
    };
  }
}

const loadGsi = () =>
  new Promise<void>((resolve, reject) => {
    if (window.google?.accounts?.oauth2) return resolve();
    const existing = document.querySelector(`script[src="${GSI_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      return;
    }
    const s = document.createElement('script');
    s.src = GSI_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('No se pudo cargar Google'));
    document.head.appendChild(s);
  });

export const GoogleLoginButton = ({
  onToken,
  disabled,
}: {
  onToken: (accessToken: string) => void;
  disabled?: boolean;
}) => {
  const clientRef = useRef<TokenClient | null>(null);
  const [ready, setReady] = useState(false);
  const onTokenRef = useRef(onToken);
  useEffect(() => { onTokenRef.current = onToken; });

  useEffect(() => {
    if (!CLIENT_ID) return;
    let active = true;
    loadGsi()
      .then(() => {
        if (!active || !window.google) return;
        clientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: 'openid email profile',
          callback: (resp) => {
            if (resp.access_token) onTokenRef.current(resp.access_token);
          },
        });
        setReady(true);
      })
      .catch(() => setReady(false));
    return () => { active = false; };
  }, []);

  const handleClick = () => {
    if (!CLIENT_ID) {
      alert('Para activar el acceso con Google, configura VITE_GOOGLE_CLIENT_ID en el archivo .env.');
      return;
    }
    clientRef.current?.requestAccessToken();
  };

  return (
    <button
      type="button"
      disabled={disabled || (!!CLIENT_ID && !ready)}
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-3 py-4 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] text-[#EFE7D7] text-[11px] font-black uppercase tracking-[0.2em] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <GoogleG />
      Continuar con Google
    </button>
  );
};

const GoogleG = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.4l-6.5 5C9.6 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.3C41.5 35.8 44 30.3 44 24c0-1.3-.1-2.3-.4-3.5z" />
  </svg>
);
