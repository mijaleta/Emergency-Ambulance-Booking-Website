importScripts('https://www.gstatic.com/firebasejs/9.6.8/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.8/firebase-messaging-compat.js');
importScripts('https://unpkg.com/waud.js');
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

self.addEventListener('push', function(event) {
  const payload = event.data ? event.data.json() : {};
  console.log('[Service Worker] Received background message:', payload);

  const channel = new BroadcastChannel('notificationChannel');
  channel.postMessage({ type: 'incrementNotificationCount' });

  const notificationTitle = payload.data.title || 'Background Message Title';
  const notificationOptions = {
    body: payload.data.body || 'Background Message body.',
    icon: '/notification.png',

  };
  // event.waitUntil(self.registration.showNotification(notificationTitle, notificationOptions));

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(notificationTitle, notificationOptions),
      playNotificationSound() // Call the function to play the sound
    ])
  );



  function playNotificationSound() {
    return new Promise(function(resolve, reject) {
      const audioContext = new (self.AudioContext || self.webkitAudioContext)();
      const request = new XMLHttpRequest();
      request.open('GET', '/s.mp3', true);
      request.responseType = 'arraybuffer';
  
      request.onload = function() {
        audioContext.decodeAudioData(request.response, function(buffer) {
          const source = audioContext.createBufferSource();
          source.buffer = buffer;
          source.connect(audioContext.destination);
          source.start(0);
          resolve();
        }, reject);
      };
  
      request.onerror = reject;
  
      request.send();
    });
  }







});
