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
        // Initialize Firebase here
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
        // Retrieve token and send to server
        return messaging.getToken({ vapidKey: 'BMbALCuu9k_sjxT-t4I2uWBDPwnsI8Zbc3Em0XobSWX5ZjSd8PVBAGpxoGYyBaxLk0PwCMSyvrbrKpH-qIgpQjc' });
      })
      .then(function (currentToken) {
        if (currentToken) {
          console.log('Token retrieved:', currentToken);
          // Send the token to your server to subscribe to the 'dispatcher' topic
          sendTokenToServer(currentToken);
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

function sendTokenToServer(token) {
  // Make a POST request to your backend with the token
  fetch('/registerToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token: token }) // Include the token in the request body
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to send token to server');
    }
    console.log('Token sent to server successfully');
  })
  .catch(error => {
  
    console.error('Error sending token to server:', error);
  });
}






// Listen for messages from service worker
navigator.serviceWorker.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'incrementNotificationCount') {
    console.log('Received message from service worker:', event.data);
    // Increase the bell icon count
    increaseNotificationCount();
  }
});

// Function to increase the bell icon count
function increaseNotificationCount() {
  const notificationCountElement = document.getElementById('notificationCount');
  let currentCount = parseInt(notificationCountElement.textContent);
  currentCount++;
  notificationCountElement.textContent = currentCount;
}


// // Handle foreground messages
// messaging.onMessage((payload) => {
//   console.log('Foreground message received:', payload);

//   // Update UI or perform other actions as needed
//   increaseNotificationCount();
// });



// Create a broadcast channel
const channel = new BroadcastChannel('notificationChannel');

// Listen for messages from broadcast channel
channel.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'incrementNotificationCount') {
    console.log('Received message from service worker:', event.data);
    // Increase the bell icon count
    increaseNotificationCount();
  }
});

// Function to increase the bell icon count
function increaseNotificationCount() {
  const notificationCountElement = document.getElementById('notificationCount');
  let currentCount = parseInt(notificationCountElement.textContent);
  currentCount++;
  notificationCountElement.textContent = currentCount;
}
