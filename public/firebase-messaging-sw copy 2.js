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

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  // Post message to client to increment bell icon count
  postMessageToClient({
    type: 'incrementNotificationCount'
  });

  // Display notification
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
  };
  return self.registration.showNotification(notificationTitle, notificationOptions);
});
