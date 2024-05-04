if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then(function (registration) {
        console.log('Service Worker Registered', registration);
        return navigator.serviceWorker.ready;
      })
      .then(function (registration) {
        console.log('Service Worker is active', registration);
        const firebaseConfig = {
          // Your Firebase configuration
        };
        const app = firebase.initializeApp(firebaseConfig);
        const messaging = firebase.messaging(app);
        return messaging.getToken({ vapidKey: 'BMbALCuu9k_sjxT-t4I2uWBDPwnsI8Zbc3Em0XobSWX5ZjSd8PVBAGpxoGYyBaxLk0PwCMSyvrbrKpH-qIgpQjc' });
      })
      .then(function (currentToken) {
        if (currentToken) {
          console.log('Token retrieved:', currentToken);
          sendTokenToServer(currentToken);
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      })
      .catch(function (err) {
        console.error('Service Worker registration or token retrieval failed:', err);
      });
  });
}

function sendTokenToServer(token) {
  fetch('/registerToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token: token })
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

navigator.serviceWorker.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'incrementNotificationCount') {
    console.log('Received message from service worker:', event.data);
    increaseNotificationCount();
  }
});

function increaseNotificationCount() {
  const notificationCountElement = document.getElementById('notificationCount');
  let currentCount = parseInt(notificationCountElement.textContent);
  currentCount++;
  notificationCountElement.textContent = currentCount;
  // localStorage.setItem('notificationCount', currentCount);

}
const channel = new BroadcastChannel('notificationChannel');
channel.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'incrementNotificationCount') {
    console.log('Received message from service worker:', event.data);
    playNotificationSound();
    increaseNotificationCount();
  }
});
function playNotificationSound() {
  // Play the notification sound (you can customize this)
  const audio = new Audio('../s.mp3');
  audio.play();
}