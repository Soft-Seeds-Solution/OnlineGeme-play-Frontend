// ---------------------------------------
// INSERT REQUIRED HTML STRUCTURE
// ---------------------------------------
document.write(`
  <!-- GPT Interstitial -->
  <div id="interstitialAd" class="ad-overlay" style="display:none;">
    <div id="div-gpt-ad-interstitial"></div>
  </div>

  <!-- GPT Rewarded -->
  <div id="rewardedAd" class="ad-overlay" style="display:none;">
    <div id="div-gpt-ad-rewarded"></div>
  </div>

  <!-- FALLBACK Interstitial -->
  <div id="customInterstitial" class="no-ad-blur" style="display:none;">
    <div class="no-ad-text">Ad Loading...</div>
  </div>

  <!-- FALLBACK Rewarded -->
  <div id="customRewarded" class="no-ad-blur" style="display:none;">
    <div class="no-ad-text">Ad Loading...</div>
  </div>
`);

// ---------------------------------------
// SHARED AD CODE
// ---------------------------------------
window.adManagerActive = true;
window.googletag = window.googletag || { cmd: [] };

let interstitialSlot, rewardedSlot;

// ---------------------------------------
// GPT SETUP
// ---------------------------------------
googletag.cmd.push(function () {

  interstitialSlot = googletag.defineSlot(
    '/123456789/webgl_interstitial',
    [1, 1],
    'div-gpt-ad-interstitial'
  ).addService(googletag.pubads());

  rewardedSlot = googletag.defineSlot(
    '/123456789/webgl_rewarded',
    [1, 1],
    'div-gpt-ad-rewarded'
  ).addService(googletag.pubads());

  googletag.pubads().addEventListener('slotRenderEnded', (e) => {
    if (e.slot === interstitialSlot && e.isEmpty)
      tryShowAdinPlayInterstitial();

    if (e.slot === rewardedSlot && e.isEmpty)
      tryShowAdinPlayRewarded();
  });

  googletag.enableServices();
});

// ---------------------------------------
// INTERSTITIAL
// ---------------------------------------
function ShowInterstitialAdFromUnity() {
  const box = document.getElementById("interstitialAd");
  box.style.display = "flex";

  if (window.adManagerActive && interstitialSlot) {
    googletag.cmd.push(() => {
      googletag.display("div-gpt-ad-interstitial");
      googletag.pubads().refresh([interstitialSlot]);
    });
  } else {
    tryShowAdinPlayInterstitial();
  }
}

function tryShowAdinPlayInterstitial() {
  if (typeof aipShowAd === "function") {
    aipShowAd({
      onComplete: closeInterstitial,
      onError: showInterstitialFallback
    });
  } else {
    showInterstitialFallback();
  }
}

function showInterstitialFallback() {
  document.getElementById("customInterstitial").style.display = "block";
  setTimeout(closeInterstitial, 4000);
}

function closeInterstitial() {
  document.getElementById("interstitialAd").style.display = "none";
  document.getElementById("customInterstitial").style.display = "none";

  if (window.gameInstance)
    gameInstance.SendMessage("ShowAd", "OnInterstitialComplete");
}

// ---------------------------------------
// REWARDED
// ---------------------------------------
function ShowRewardedAdFromUnity() {
  const box = document.getElementById("rewardedAd");
  box.style.display = "flex";

  if (window.adManagerActive && rewardedSlot) {
    googletag.cmd.push(() => {
      googletag.display("div-gpt-ad-rewarded");
      googletag.pubads().refresh([rewardedSlot]);
    });
  } else {
    tryShowAdinPlayRewarded();
  }
}

function tryShowAdinPlayRewarded() {
  if (typeof aipShowAd === "function") {
    aipShowAd({
      onComplete: closeRewarded,
      onError: showRewardedFallback
    });
  } else {
    showRewardedFallback();
  }
}

function showRewardedFallback() {
  document.getElementById("customRewarded").style.display = "block";
  setTimeout(closeRewarded, 4000);
}

function closeRewarded() {
  document.getElementById("rewardedAd").style.display = "none";
  document.getElementById("customRewarded").style.display = "none";

  if (window.gameInstance)
    gameInstance.SendMessage("ShowAd", "OnRewardedComplete");
}