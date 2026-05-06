(function () {
  var deferredPrompt = null;
  var pwaModal = document.getElementById("pwaModal");
  var installBtn = document.getElementById("pwaInstallBtn");
  var laterBtn = document.getElementById("pwaLaterBtn");

  if (window.matchMedia('(display-mode: standalone)').matches) {
    return;
  }

  var lastPwaReject = localStorage.getItem('pwaRejectTime');
  if (lastPwaReject) {
    var now = Date.now();
    var diff = now - parseInt(lastPwaReject);
    if (diff < 24 * 60 * 60 * 1000) {
      return;
    }
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    pwaModal.classList.remove('hidden');
  });

  installBtn.addEventListener('click', function () {
    pwaModal.classList.add('hidden');
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function (choiceResult) {
        if (choiceResult.outcome === 'accepted') {
          console.log('PWA installée');
        }
        deferredPrompt = null;
      });
    }
  });

  laterBtn.addEventListener('click', function () {
    pwaModal.classList.add('hidden');
    localStorage.setItem('pwaRejectTime', Date.now());
  });
})();
