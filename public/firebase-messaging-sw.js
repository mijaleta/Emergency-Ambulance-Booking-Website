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
// Handle background messages
// Handle background messages
messaging.onBackgroundMessage(async function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message', payload);

  // Post message to the specific client to increment bell icon count
  const client = await self.clients.get(payload.clientId);
  if (client) {
    client.postMessage({
      type: 'incrementNotificationCount'
    });
  }

  // Display notification
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
  };
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

