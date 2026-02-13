/* eslint-disable no-undef */
// Firebase Messaging Service Worker
// This runs in the background to receive push notifications when the tab is not focused

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDBJgZO200L2KrfS4tKtE5VyTKKUZrULvk',
  authDomain: 'nammamatrimonyapp.firebaseapp.com',
  projectId: 'nammamatrimonyapp',
  storageBucket: 'nammamatrimonyapp.firebasestorage.app',
  messagingSenderId: '171195418276',
  appId: '1:171195418276:web:b31ecb170ecfa29c4b4831',
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'Namma Naidu';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/logo192.png',
    badge: '/logo192.png',
    image: payload.notification?.image || undefined,
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing tab or open new one
      for (const client of clientList) {
        if (client.url.includes('nammanaidu.cloud') && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow('/');
    })
  );
});
