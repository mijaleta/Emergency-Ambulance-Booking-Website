if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(function (registration) {
          console.log('Service Worker Registered', registration);
          // Wait for the service worker to become active
          return navigator.serviceWorker.ready;
        })
        .then(function (registration) {
          console.log('Service Worker is active', registration);
          // Initialize Firebase here and get the token
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
          const app = firebase.initializeApp(firebaseConfig);
          const messaging = firebase.messaging(app);
          return messaging.getToken({ vapidKey: 'BMbALCuu9k_sjxT-t4I2uWBDPwnsI8Zbc3Em0XobSWX5ZjSd8PVBAGpxoGYyBaxLk0PwCMSyvrbrKpH-qIgpQjc' });
        })
        .then(function (currentToken) {
          if (currentToken) {
            console.log('Token retrieved:', currentToken);
            // Send the token to your server to subscribe to the 'dispatcher' topic
          } else {
            console.log('No registration token available. Request permission to generate one.');
            // Show permission UI
          }
        })
        .catch(function (err) {
          console.error('Service Worker registration or token retrieval failed:', err);
        });
    });
  }
  