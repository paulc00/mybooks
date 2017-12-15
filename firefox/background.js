var lastChecked = 0;

function updateIcon(syncStatus) {
  switch (syncStatus) {
      case 0:
          syncIcon = "icons/mybooks-grey2.svg";
          break;
      case 1:
          syncIcon = "icons/mybooks-red2.svg";
          break;
      case 2:
          syncIcon = "icons/mybooks-yellow2.svg";
          break;
      case 3:
          syncIcon = "icons/mybooks-green2.svg";
  }
  browser.browserAction.setIcon({path: syncIcon});
}

function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkSync() {
  var lastChanged;
  var syncStatus = 0;

  // Read lastChanged from Server
  lastChanged = 1; /// placeholder
  if (false) {
    syncStatus = -1;
  }
  // Compare with local
  if (lastChanged > lastChecked && syncStatus != -1) { // Server is newer
    updateIcon(0);
    // Detailed comparison
    let parentNode = await browser.bookmarks.getTree();
//    await sleep(2000);
    // Set syncStatus
    syncStatus = 3; // if synced
    syncStatus = 1; // if not synced
    // SetIcon
    updateIcon(syncStatus);
  }

  return syncStatus
}

async function syncBooks() {

  if (await checkSync() == 1) {
    updateIcon(2);
    // sync
    await sleep(5000);
    // set lastChanged to timestamp-now
    // Update the button
    checkSync();
  }
}


// On start up, check the DB
checkSync();

// Set up an alarm to check this regularly.
browser.alarms.onAlarm.addListener(checkSync);
browser.alarms.create('checkSync', {periodInMinutes: 1});

// Sync on button click
browser.browserAction.onClicked.addListener(syncBooks);
// Sync on bookmark change
browser.bookmarks.onChanged.addListener(syncBooks)
