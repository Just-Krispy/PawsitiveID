// PawsitiveID Push Notification Service Worker

self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || "A matching dog was found near you!",
    icon: data.icon || "/icon-192.png",
    badge: "/icon-192.png",
    data: { url: data.url || "/" },
    actions: [{ action: "view", title: "View Profile" }],
    vibrate: [200, 100, 200],
    tag: "pawsitiveid-alert",
    renotify: true,
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || "PawsitiveID Alert",
      options
    )
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // Focus existing tab if open
      for (const client of windowClients) {
        if (client.url.includes("pawsitiveid") && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Otherwise open new tab
      return clients.openWindow(url);
    })
  );
});
