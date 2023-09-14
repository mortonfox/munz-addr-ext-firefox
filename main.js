// jshint strict: true, esversion: 8

async function run() {
  'use strict';

  // Check if we are on a munzee page.
  let loc = window.location.href;
  // console.log(loc);
  if (!/munzee.com\/m\/\w+\/\d+/.test(loc)) return;

  let mappage = loc.replace(/(munzee.com\/m\/\w+\/\d+).*$/, '$1/map/');
  // console.log(mappage);

  let iframe = document.createElement("iframe");
  iframe.style.display = 'none';
  iframe.src = mappage;
  document.body.appendChild(iframe);

  async function waitForElem(getter) {
    while (getter() == null) {
      await new Promise(resolve =>  requestAnimationFrame(resolve));
    }
    return getter();
  }

  let elem = await waitForElem(() => iframe.contentWindow.document.getElementById('munzee-holder'));
  let coords = [];
  for (let node of elem.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      let str = node.textContent.trim();
      let m = str.match(/^(-?\d+\.\d+)$/);
      if (m) {
        coords.push(parseFloat(m[1]));
      }
    }
  }

  iframe.remove();

  // console.log(coords);

  if (coords.length < 2) return;

  let [lat, lon] = coords;

  let fragment = new DocumentFragment();

  function addElem(elem) {
    const el = document.createElement('div');
    el.style.textAlign = 'center';
    el.appendChild(elem);
    fragment.appendChild(el);
  }

  function addText(str) {
    addElem(document.createTextNode(str));
  }

  addText(`${lat.toFixed(5)},${lon.toFixed(5)}`);

  function degmin(coord) {
    const deg = Math.trunc(coord);
    const min = Math.trunc((coord % 1) * 60 * 1000) / 1000;
    return `${deg} ${min.toFixed(3)}`;
  }

  addText(`${lat >= 0 ? 'N' : 'S'} ${degmin(Math.abs(lat))} ${lon >= 0 ? 'E' : 'W'} ${degmin(Math.abs(lon))}`);

  // Display message for 1 second and then remove it.
  function flashResult(color, message) {
    const status = document.getElementById('copy_status');
    status.style.color = color;
    status.textContent = message;
    setTimeout(() => { status.textContent = ''; }, 1000);
  }

  // Create a button that copies the addr string to the clipboard.
  function copyButton(addr) {
    const btn = document.createElement('button');
    btn.name = btn.id = 'copy_addr';
    btn.style.cssText = 'background-color: #fff; color: #E82A24; font-weight: 700; border: solid #E82A24; padding: 6px 10px; cursor: pointer';
    btn.appendChild(document.createTextNode('Copy Addr'));
    btn.addEventListener('mouseenter',
      () => {
        btn.style.color = '#fff';
        btn.style.backgroundColor = '#E82A24';
      }
    );
    btn.addEventListener('mouseleave',
      () => {
        btn.style.color = '#E82A24';
        btn.style.backgroundColor = '#fff';
      }
    );
    btn.addEventListener('click',
      async () => {
        try {
          await navigator.clipboard.writeText(addr);
          flashResult('green', 'Copied!');
        }
        catch (err) {
          flashResult('red', `Copy failed! ${err.message}`);
        }
      }
    );
    return btn;
  }

  // Get Bing Maps API key from local storage.
  function getKey() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('bingMapsKey', result => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(result.bingMapsKey);
      });
    });
  }

  try {
    const key = await getKey();
    const url = `https://dev.virtualearth.net/REST/v1/Locations/${lat},${lon}?key=${key}`;

    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`Status = ${resp.status} ${resp.statusText}`);

      const jsonobj = await resp.json();

      const addr = jsonobj.resourceSets[0].resources[0].name;
      if (addr === undefined) return;

      addText(addr);

      const span = document.createElement('span');
      span.appendChild(copyButton(addr));
      span.appendChild(document.createElement('br'));
      const status = document.createElement('span');
      status.id = status.name = 'copy_status';
      span.appendChild(status);
      addElem(span);
    }
    catch (err) {
      addText(`Bing Maps API fetch error: ${err.message}`);
    }
  }
  catch (err) {
    addText(`Failed to get Bing Maps API key from browser local storage: ${err.message}`);
  }

  // Add the text and button only if not already there
  let locimage = await waitForElem(() => document.getElementById('locationimage'));
  if (!document.getElementById('copy_addr')) locimage.appendChild(fragment);
}

// Run the address inserter the first time and also whenever the URL changes.
// Some links in the new Munzee web interface do not reload the page.
const observeUrlChange = () => {
  let oldHref = null;
  const body = document.querySelector('body');
  const observer = new MutationObserver(mutations => {
    if (oldHref !== document.location.href) {
      oldHref = document.location.href;
      run();
    }
  });
  observer.observe(body, { childList: true, subtree: true });
};

// window.onload = observeUrlChange;
observeUrlChange();

// -- The End --

