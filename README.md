# Munz Addr Browser Extension (Firefox version)

## Introduction

[Munzee](https://www.munzee.com) info pages used to display the approximate address of the Munzee's coordinates below the mini map. This feature seems to have been dropped after the switchover from Google Maps to OpenStreetMap.

Munz Addr is a Firefox extension that uses the [Geocodify API](https://geocodify.com/) to reverse-geocode a Munzee's coordinates and adds the resulting street address below the mini map, where it used to be.

![Street address below the map](https://raw.githubusercontent.com/mortonfox/munz-addr-ext-firefox/main/docs/addr_below_map_firefox.png)

## Installation

### Installing the Add-on

Check <https://github.com/mortonfox/munz-addr-ext-firefox/releases> for signed builds of the browser extension. Clicking on the link for an xpi file should bring up an installation dialog.

### Obtaining and setting up your Geocodify API key

You'll need a Geocodify API key to use this Firefox extension.

Get the API key by visiting your [Geocodify account dashboard](https://geocodify.com/account) The link will take you to a login/signup page if you have not done so already.

To add the Geocodify API key to the extension:

* Click on the Extensions icon (jigsaw puzzle piece) in the toolbar.
* Find the "Munz Addr" extension in the list and click on its gear icon.
* Click on "Manage Extension"
* Click on the "Preferences" tab.
* Add the Geocodify API key to the input box.
* Click on "Save".

![Options popup](https://raw.githubusercontent.com/mortonfox/munz-addr-ext-firefox/main/docs/options_firefox.png)

## Usage

If all goes well, you'll see the street address below the mini map on the info page of every Munzee. If not, check the console log in the browser developer tools for errors.

