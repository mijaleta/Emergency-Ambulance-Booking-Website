// Import and configure the Firebase SDK
importScripts('https://www.gstatic.com/firebasejs/9.6.8/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.8/firebase-messaging-compat.js');
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAsa3Qp2X-JddKBjicW6dLH6pVv6yiUV24",
    authDomain: "ambulancebooking-812cd.firebaseapp.com",
    projectId: "ambulancebooking-812cd",
    storageBucket: "ambulancebooking-812cd.appspot.com",
    messagingSenderId: "887269267926",
    appId: "1:887269267926:web:fff487690a9b8364e02c77",
    measurementId: "G-H5CN5R5BLD"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Retrieve an instance of Firebase Messaging so that it can handle background messages
const messaging = firebase.messaging();
// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    // icon: '/icons/icon-192x192.png',
    // click_action: 'URL_OF_YOUR_CHOICE' 
    // Optional: add a click action URL
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
