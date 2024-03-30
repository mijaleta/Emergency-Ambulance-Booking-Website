importScripts('https://www.gstatic.com/firebasejs/9.6.8/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.8/firebase-messaging-compat.js');

// Initialize Firebase app in the service worker
const firebaseConfig = {
  apiKey: "AIzaSyAsa3Qp2X-JddKBjicW6dLH6pVv6yiUV24",
  authDomain: "ambulancebooking-812cd.firebaseapp.com",
  projectId: "ambulancebooking-812cd",
  storageBucket: "ambulancebooking-812cd.appspot.com",
  messagingSenderId: "887269267926",
  appId: "1:887269267926:web:fff487690a9b8364e02c77",
  measurementId: "G-H5CN5R5BLD"
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Function to post message to the client
function postMessageToClient(message) {
  return self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage(message);
      console.log('Message sent to client:', message);

    });
  });
}

self.addEventListener('push', function(event) {
  const payload = event.data ? event.data.json() : {};
  console.log('[Service Worker] Received background message:', payload);

  // Post message to client to increment bell icon count
// Post message to client to increment bell icon count
self.clients.matchAll().then(clients => {
  clients.forEach(client => {
    client.postMessage({ type: 'incrementNotificationCount' });
  });
});


// Create a broadcast channel
const channel = new BroadcastChannel('notificationChannel');

// Post message to broadcast channel to increment bell icon count
channel.postMessage({ type: 'incrementNotificationCount' });


  // Display notification
  const notificationTitle = payload.data.title || 'Background Message Title';
  const notificationOptions = {
    body: payload.data.body || 'Background Message body.',
  };
  event.waitUntil(self.registration.showNotification(notificationTitle, notificationOptions));
});
