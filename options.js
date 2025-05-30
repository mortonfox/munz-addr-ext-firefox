// jshint strict: true, esversion: 8

function flash_result(color, message) {
  'use strict';
  const status = document.getElementById('status');
  status.style.color = color;
  status.textContent = message;
  setTimeout(() => { status.textContent = ''; }, 2000);
}

// Saves Geocodify key to browser local storage.
async function save_options() {
  'use strict';
  const geocodify_key = document.getElementById('geocodify_key').value;
  try {
    // Test the key.
    const resp = await fetch(`https://api.geocodify.com/v2/reverse?api_key=${geocodify_key}&lat=1&lng=1`);
    if (!resp.ok) throw new Error(`Status = ${resp.status} ${resp.statusText}`);

    try {
      await setKey(geocodify_key);
      flash_result('green', 'Options saved.');
    }
    catch (err) {
      flash_result('red', `Error saving key to browser local storage: ${err.message}`);
    }
  }
  catch (err) {
    flash_result('red', `Invalid key or other Geocodify error. ${err.message}`);
  }
}

// Restores Geocodify key from browser local storage.
async function restore_options() {
  'use strict';
  try {
    let key = await getKey();
    document.getElementById('geocodify_key').value = key;
  }
  catch (err) {
    flash_result('red', `Error retrieving Geocodify API key from browser local storage. ${err.message}`);
  }
}

// Get Geocodify API key from browser local storage.
function getKey() {
  'use strict';
  return new Promise((resolve, reject) => {
    chrome.storage.local.get({geocodifyKey: ''}, result => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(result.geocodifyKey);
    });
  });
}

// Write Geocodify API key to browser local storage.
function setKey(val) {
  'use strict';
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({geocodifyKey: val}, result => {
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
