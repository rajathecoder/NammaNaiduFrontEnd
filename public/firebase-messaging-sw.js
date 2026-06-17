/* eslint-disable no-undef */
// Firebase Messaging Service Worker
// This runs in the background to receive push notifications when the tab is not focused

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Read Firebase config from URL query parameters
const urlParams = new URLSearchParams(location.search);
const firebaseConfig = {
  apiKey: urlParams.get('apiKey'),
  authDomain: urlParams.get('authDomain'),
  projectId: urlParams.get('projectId'),
  storageBucket: urlParams.get('storageBucket'),
  messagingSenderId: urlParams.get('messagingSenderId'),
  appId: urlParams.get('appId'),
};

if (firebaseConfig.apiKey) {
  firebase.initializeApp(firebaseConfig);
}

const messaging = firebaseConfig.apiKey ? firebase.messaging() : null;

// Handle background messages
if (messaging) {
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
}

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
