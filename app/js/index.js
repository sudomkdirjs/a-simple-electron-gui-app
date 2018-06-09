'use strict';

const electron = require('electron');
const {ipcMain, ipcRenderer, app, Menu, Tray} = electron;
const path = require('path');

var soundButtons = document.querySelectorAll('.button-sound');

for (var i = 0; i < soundButtons.length; i++) {
    var soundButton = soundButtons[i];
    var soundName = soundButton.attributes['data-sound'].value;

    prepareButton(soundButton, soundName);
}

function prepareButton(buttonEl, soundName) {
  buttonEl.querySelector('span').style.backgroundImage = 'url("img/icons/' + soundName + '.png")';

  var audio = new Audio(__dirname + '/wav/' + soundName + '.wav');
  buttonEl.addEventListener('click', function () {
    audio.currentTime = 0;
    audio.play();
  });
}

let closeEl = document.querySelector('.close');
closeEl.addEventListener('click', function () {
    ipcRenderer.send('close-main-window');
});

ipcRenderer.on('global-shortcut', function (e, arg) {
    var event = new MouseEvent('click');
    soundButtons[arg].dispatchEvent(event);
});

var settingsEl = document.querySelector('.settings');
settingsEl.addEventListener('click', function () {
    ipcRenderer.send('open-settings-window');
});

///

var trayIcon = null;

// app.on('ready', () => {
	if (process.platform === 'darwin') {
		trayIcon = new Tray(path.join(__dirname, 'img/tray-iconTemplate.png'));
	}
	else {
	    trayIcon = new Tray(path.join(__dirname, 'img/tray-icon-alt.png'));
	}

	let trayMenuTemplate = [
	    {
	        label: 'Sound machine',
	        enabled: false
	    },
	    {
	        label: 'Settings',
	        click: function () {
	            ipcRenderer.send('open-settings-window');
	        }
	    },
	    {
	        label: 'Quit',
	        click: function () {
	            ipcRenderer.send('close-main-window');
	        }
	    }
	];
	let trayMenu = Menu.buildFromTemplate(trayMenuTemplate);
	trayIcon.setToolTip('This is my application.')
	trayIcon.setContextMenu(trayMenu);
// });