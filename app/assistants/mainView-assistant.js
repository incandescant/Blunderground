/*
 * Blunderground - an open source tube application for the Palm WebOS
 * Copyright (C) 2010 Joshua Lock. All rights reserved.
 *               2010 Neil Roberts
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License version
 * 2.1 as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
 * 02110-1301, USA.
 *
 * Written by - Joshua Lock <joshual@joshual.me.uk>
 *              Neil Roberts <bpeeluk@yahoo.co.uk>
 *
 */

function MainViewAssistant(status) {
    this.status = status;
}

/* Approximate radius of the earth in kilometers (taken from
 * Wikipedia) */
MainViewAssistant.EARTH_RADIUS = 6371;

MainViewAssistant.prototype.setup = function() {
    this.handleOrientation = this.handleOrientation.bindAsEventListener(this);
    this.controller.listen(document, 'orientationchange', this.handleOrientation);

    this.controller.setupWidget(Mojo.Menu.appMenu,
                                this.attributes = {
                                    //omitDefaultItems: true
                                },
                                this.model = {
                                    visible: true,
                                    items: [
                                        { label: "About Blunderground...",
                                          command: "do-aboutBlunderground"}
                                    ]
                                }
                                );

    this.commandMenuModel = {
        label: "Map Menu",
        items: [{label: "Tube Status", command: "do-tubeStatus"},
                {label: "Jump to Nearest", command: "do-jumpToNearest"}
        ]
    };
    this.controller.setupWidget(Mojo.Menu.commandMenu, undefined,
                                this.commandMenuModel);

    this.controller.setupWidget("mapScroller", { mode: "free" },
                                this.mapScrollerModel = {});

    $("mapScroller").style.width = Mojo.Environment.DeviceInfo.maximumCardWidth;
    $("mapScroller").style.height = Mojo.Environment.DeviceInfo.maximumCardHeight;

    this.ctx = $("mapCanvas").getContext("2d");
    this.background = new Image();
    this.background.src = "images/tube-map.png";
};

MainViewAssistant.prototype.activate = function(event) {
    this.ctx.drawImage(this.background, 0, 0);
};

MainViewAssistant.prototype.deactivate = function(event) {
};

MainViewAssistant.prototype.cleanup = function(event) {
    this.controller.stopListening(document, 'orientationchange', this.handleOrientation);
};

/* Based on http://mathforum.org/library/drmath/view/51722.html
 * pos1 and pos2 are objects which contain a latitude and longitude
 * property on degrees. The function returns a distance in
 * kilometers. I think this isn't very accurate because it assumes the
 * earth is a sphere */
MainViewAssistant.prototype.calculateDistance = function(pos1, pos2) {
    /* Convert to radians */
    var lat1 = pos1.latitude * Math.PI / 180;
    var lon1 = pos1.longitude * Math.PI / 180;
    var lat2 = pos2.latitude * Math.PI / 180;
    var lon2 = pos2.longitude * Math.PI / 180;

    var aob = Math.acos(Math.cos(lat1) * Math.cos(lat2) *
                        Math.cos(lon2 - lon1) +
                        Math.sin(lat1) * Math.sin(lat2));

    return MainViewAssistant.EARTH_RADIUS * aob;
};

MainViewAssistant.prototype.prettyDistance = function(distance) {
    if (distance >= 1)
        return Mojo.Format.formatNumber(distance, {
                fractionDigits: 2 }) + "km";
    else if (distance >= 0.001)
        return Mojo.Format.formatNumber(distance * 1000, {
                fractionDigits: 2 }) + "m";
    else
        return Mojo.Format.formatNumber(distance * 100000, {
                fractionDigits: 2 }) + "cm";
}

MainViewAssistant.prototype.doJumpToNearest = function(response) {
    var bestStation;
    var bestDistance;
    var stationNum;

    /* Find the nearest station. There's probably much better ways to
     * do this */
    for (stationNum = 0; stationNum < STATION_DATA.length; stationNum++) {
        var station = STATION_DATA[stationNum];
        var distance = this.calculateDistance(response, station);
        if (bestStation == undefined || bestDistance > distance) {
            bestStation = station;
            bestDistance = distance;
        }
    }

    var scroller = $("mapScroller");
    scroller.mojo.scrollTo(scroller.offsetWidth / 2.0 - bestStation.imagex,
                           /* FIXME - using the offsetHeight doesn't
                            * work well here */
                           100 - bestStation.imagey,
                           true);

    this.ctx.strokeStyle = 'rgba(0,0,255, 0.5)';
    this.ctx.fillStyle = 'rgba(0,0,255,0.25)';
    this.ctx.lineWidth = 1;
    this.ctx.font = "12px sans-serif";

    this.ctx.beginPath();
    this.ctx.arc(bestStation.imagex, bestStation.imagey, 25, 0, Math.PI*2, true);
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.fill();

    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(bestStation.imagex + 20, bestStation.imagey - 50,
                        180, 30);
    this.ctx.strokeRect(bestStation.imagex + 20, bestStation.imagey - 50,
                        180, 30);
    this.ctx.fillStyle = '#000';
    this.ctx.strokeText("Your nearest station is " + bestStation.name + ",",
                        bestStation.imagex + 25, bestStation.imagey - 40);
    this.ctx.strokeText("which is " + this.prettyDistance(bestDistance) + " away",
                        bestStation.imagex + 45, bestStation.imagey - 25);

    this.timeoutId = setTimeout(this.clearOverlay.bind(this), 10000);
};

MainViewAssistant.prototype.clearOverlay = function() {
    Mojo.Log.info("Clear map overlay");

    var canvas = $("mapCanvas");
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.drawImage(this.background, 0, 0);

    this.clearTimeout(this.timeoutId);
};

MainViewAssistant.prototype.notifyNoLocation = function(response) {
    Mojo.Log.info("Unable to get your current location");
};

MainViewAssistant.prototype.jumpToNearest = function() {
    this.controller.serviceRequest('palm://com.palm.location', {
            method: 'getCurrentPosition',
            /* Set the maximum age parameter to let the service know
             * that we can accept a cached value that is less than 5
             * seconds old */
            parameters: { maximumAge: 5 },
            onSuccess: this.doJumpToNearest.bind(this),
            onFailure: this.notifyNoLocation.bind(this)
        });
};

MainViewAssistant.prototype.handleCommand = function(event) {
    var stageController = Mojo.Controller.getAppController().getActiveStageController();

    if (event.type == Mojo.Event.command) {
        switch(event.command) {
        case "do-aboutBlunderground":
            this.controller.showAlertDialog({
                 onChoose: function(value) {},
                 title: "Blunderground - an app for the Underground",
                 message: "Copyright 2010, Joshua Lock",
                 choices: [
                     {label: "OK", value:""}
                 ]
            });
            break;
        case "do-tubeStatus":
            stageController.swapScene("statusView", this.status);
            break;
        case "do-jumpToNearest":
            this.jumpToNearest();
            break;
      }
  }
};

MainViewAssistant.prototype.handleOrientation = function(event) {
    $("mapScroller").style.width = this.controller.window.innerWidth + "px";
    $("mapScroller").style.height= this.controller.window.innerHeight; + "px";
}
