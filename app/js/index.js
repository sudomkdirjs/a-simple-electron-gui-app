'use strict';

const electron = require('electron');
const {ipcMain, ipcRenderer, app, Menu, Tray, nativeImage} = electron;
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

let trayIcon = null;
let iconPath = '';

// app.on('ready', () => {

	if (process.platform === 'darwin') {
		iconPath = path.join(__dirname, 'img/tray-iconTemplate.png');
	}
	else {
			iconPath = path.join(__dirname, 'img/tray-iconTemplate.png');
	}

	// let nimage = nativeImage.createFromPath(iconPath);
	trayIcon = new Tray(iconPath);

	alert(iconPath)

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
	trayIcon.setToolTip('Sound Machine')
	trayIcon.setContextMenu(trayMenu);
// });