// Uzantı yüklendiğinde (veya güncellendiğinde) çalışacak kod
chrome.runtime.onInstalled.addListener(() => {
  // Yeni bir pencere oluştur ve kök dizindeki index.html dosyasını yükle
  chrome.windows.create({
    url: "index.html", // Kök dizindeki index.html
    type: "popup",    // Yeni bir pencere türü (tarayıcı çerçevesiz olabilir)
    width: 1920,
    height: 1080
  });
});