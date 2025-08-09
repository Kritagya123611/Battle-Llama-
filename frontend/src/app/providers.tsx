'use client';

import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

export function Providers({ children }: { children: React.ReactNode }) {
  const clientId = '739757973466-td0kkbs2u8ebkumd7n7esu70alcctsvc.apps.googleusercontent.com';
  
  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}