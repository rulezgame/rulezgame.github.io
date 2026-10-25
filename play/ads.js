// Ads for the iOS app, through Google AdMob (@capacitor-community/admob).
// In the browser there is no AdMob, so everything here quietly does nothing.
//
// Two kinds of ad:
//   - a reward video at game over: watch it and you play on with 1 heart (once per game)
//   - a full-screen ad before every 3rd new game
//
// The IDs below are Google's public TEST IDs. Before release, swap in your own
// from admob.google.com and set TESTING to false.

const ADS = {
  TESTING: true,
  rewarded: 'ca-app-pub-3940256099942544/1712485313',
  interstitial: 'ca-app-pub-3940256099942544/4411468910',
  gamesPerInterstitial: 3,
};

const ads = (() => {
  const AdMob = window.Capacitor?.isNativePlatform?.() ? window.Capacitor.Plugins?.AdMob : null;
  let ready = false;          // AdMob initialised and consent allows ads
  let rewardLoaded = false;
  let interstitialLoaded = false;
  let gamesSinceAd = 0;
  let privacyRequired = false;

  const opts = id => ({ adId: id, isTesting: ADS.TESTING });

  // Shows a full-screen ad and resolves once it is closed (or failed to show).
  // Returns true if the `earned` event fired (a reward video watched to the end).
  async function showUntilClosed(show, closed, failed, earned) {
    let earn = false;
    const subs = [];
    const done = new Promise(res => {
      subs.push(AdMob.addListener(closed, () => res()));
      subs.push(AdMob.addListener(failed, () => res()));
      if (earned) subs.push(AdMob.addListener(earned, () => { earn = true; }));
    });
    try {
      show().catch(() => {});   // the reward call only settles when earned, so don't await it
      await done;
    } finally {
      for (const s of subs) (await s).remove();
    }
    return earn;
  }

  async function loadReward() {
    if (!ready) return;
    rewardLoaded = false;
    try { await AdMob.prepareRewardVideoAd(opts(ADS.rewarded)); rewardLoaded = true; } catch { /* no fill, try later */ }
  }

  async function loadInterstitial() {
    if (!ready) return;
    interstitialLoaded = false;
    try { await AdMob.prepareInterstitial(opts(ADS.interstitial)); interstitialLoaded = true; } catch { /* no fill */ }
  }

  // Consent first (EU/UK users see Google's form), then Apple's tracking prompt, then AdMob.
  async function init() {
    if (!AdMob) return;
    try {
      let consent = await AdMob.requestConsentInfo();
      if (consent.isConsentFormAvailable && consent.status === 'REQUIRED') {
        consent = await AdMob.showConsentForm();
      }
      privacyRequired = consent.privacyOptionsRequirementStatus === 'REQUIRED';
      if (consent.canRequestAds === false) return;

      const { status } = await AdMob.trackingAuthorizationStatus();
      if (status === 'notDetermined') await AdMob.requestTrackingAuthorization();

      await AdMob.initialize({ initializeForTesting: ADS.TESTING });
      ready = true;
      loadReward();
      loadInterstitial();
    } catch (e) {
      console.warn('Ads unavailable', e);
    }
  }

  return {
    init,
    get native() { return !!AdMob; },
    get privacyRequired() { return privacyRequired; },
    get canReward() { return ready && rewardLoaded; },

    // Resolves true only if the player watched to the end and earned the heart.
    async showReward() {
      if (!this.canReward) return false;
      rewardLoaded = false;
      try {
        return await showUntilClosed(() => AdMob.showRewardVideoAd(),
          'onRewardedVideoAdDismissed', 'onRewardedVideoAdFailedToShow', 'onRewardedVideoAdReward');
      } catch {
        return false;
      } finally {
        loadReward();
      }
    },

    // Call when a game ends; before the next one starts, maybe show a full-screen ad.
    gameEnded() { gamesSinceAd++; },
    async beforeGame() {
      if (!ready || !interstitialLoaded || gamesSinceAd < ADS.gamesPerInterstitial) return;
      gamesSinceAd = 0;
      interstitialLoaded = false;
      try {
        await showUntilClosed(() => AdMob.showInterstitial(), 'interstitialAdDismissed', 'interstitialAdFailedToShow');
      } catch { /* skip */ }
      loadInterstitial();
    },

    async privacyOptions() {
      if (!AdMob) return;
      try { await AdMob.showPrivacyOptionsForm(); } catch { /* not needed here */ }
    },
  };
})();

ads.init();
