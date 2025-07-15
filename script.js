   const scriptURL = "https://script.google.com/macros/s/AKfycbxIuutsM4eAdSl7cCTrAhdJH64d2el0ZRZpAOOlju47A22R__dDUoOl5v7ZDI2bhm_RPw/exec";

    let lastScanned = "";
    let resetTimer = null;

    function showStatus(message, isSuccess) {
      const status = document.getElementById("status");
      status.innerText = message;
      status.className = isSuccess ? "success" : "error";
    }

    function onScanSuccess(decodedText, decodedResult) {
    if (decodedText === lastScanned) return;

    const parts = decodedText.split("|");
    if (parts.length !== 3) {
        showStatus("❌ Invalid QR format. Expected: Status|Name|Email", false);
        return;
    }

    lastScanned = decodedText;
    const url = `${scriptURL}?q=${encodeURIComponent(decodedText)}`;
    console.log("Sending to:", url);

    window.open(url, "_blank");

    showStatus("✅ Scan submitted successfully!", true);

    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
        lastScanned = "";
        showStatus("Ready to scan again.", true);
    }, 3000);
    }



    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        const cameraId = devices[0].id;
        new Html5Qrcode("reader").start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          onScanSuccess
        );
      } else {
        showStatus("❌ No camera found", false);
      }
    }).catch(err => {
      console.error(err);
      showStatus("❌ Camera access error", false);
    });