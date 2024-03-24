// Register the service worker from your main JavaScript file
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then(function(registration) {
      console.log('Service Worker Registered', registration);
      // Wait for the service worker to become active
      return navigator.serviceWorker.ready;
    })
    .then(function(registration) {
      console.log('Service Worker is active', registration);
      // Initialize Firebase here and get the token
      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);
      return getToken(messaging, { vapidKey: 'BMbALCuu9k_sjxT-t4I2uWBDPwnsI8Zbc3Em0XobSWX5ZjSd8PVBAGpxoGYyBaxLk0PwCMSyvrbrKpH-qIgpQjc' });
    })
    .then(function(currentToken) {
      if (currentToken) {
        console.log('Token retrieved:', currentToken);
        // Send the token to your server to subscribe to the 'dispatcher' topic
      } else {
        console.log('No registration token available. Request permission to generate one.');
        // Show permission UI
      }
    })
    .catch(function(err) {
      console.error('Service Worker registration or token retrieval failed:', err);
    });
}
