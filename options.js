// jshint strict: true, esversion: 8

function flash_result(color, message) {
  'use strict';
  const status = document.getElementById('status');
  status.style.color = color;
  status.textContent = message;
  setTimeout(() => { status.textContent = ''; }, 1000);
}

// Saves Bing Maps key to browser local storage.
async function save_options() {
  'use strict';
  const bing_maps_key = document.getElementById('bing_maps_key').value;
  try {
    // Test the key.
    const resp = await fetch(`https://dev.virtualearth.net/REST/v1/Locations/0,0?key=${bing_maps_key}`);
    if (!resp.ok) throw new Error(`Status = ${resp.status} ${resp.statusText}`);

    try {
      await setKey(bing_maps_key);
      flash_result('green', 'Options saved.');
    }
    catch (err) {
      flash_result('red', `Error saving key to browser local storage: ${err.message}`);
    }
  }
  catch (err) {
    flash_result('red', `Invalid key or other Bing Maps error. ${err.message}`);
  }
}

// Restores Bing Maps key from browser local storage.
async function restore_options() {
  'use strict';
  try {
    let key = await getKey();
    document.getElementById('bing_maps_key').value = key;
  }
  catch (err) {
    flash_result('red', `Error retrieving Bing Maps API key from browser local storage. ${err.message}`);
  }
}

// Get Bing Maps API key from browser local storage.
function getKey() {
  'use strict';
  return new Promise((resolve, reject) => {
    chrome.storage.local.get({bingMapsKey: ''}, result => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(result.bingMapsKey);
    });
  });
}

// Write Bing Maps API key to browser local storage.
function setKey(val) {
  'use strict';
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({bingMapsKey: val}, result => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve();
    });
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('munz_addr_options').addEventListener('submit', e => {
  'use strict';
  save_options();
  e.preventDefault();
});

// -- The End --
