/*
 * Blunderground - an open source tube application for the Palm WebOS
 * Copyright (C) 2010 Joshua Lock. All rights reserved.
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
 *
 */

function StatusViewAssistant(status) {
    this.status = status;
}

StatusViewAssistant.prototype.setup = function() {
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
        label: "Status Menu",
        items: [
            {label: "Tube Map", command: "do-tubeMap"},
            {label: "Refresh Status", command: "do-updateStatus"}
        ]
    };

    this.controller.get("statusListMain").hide();

    this.controller.setupWidget(Mojo.Menu.commandMenu, undefined,
                                this.commandMenuModel);

    this.controller.setupWidget("statusListWidget",
                               {
                                   itemTemplate:"statusView/statusRowTemplate",
                                   listTemplate:"statusView/statusListTemplate",
                                   swipeToDelete: false,
                                   renderLimit: 20,
                                   reorderable: false
                               },
    this.statusListModel = { items: this.status.list });

    this.showStatusHandler = this.showStatus.bindAsEventListener(this);
    this.controller.listen("statusListWidget", Mojo.Event.listTap,
                          this.showStatusHandler);
};

StatusViewAssistant.prototype.activate = function(event) {
    this.status.registerListModel(this);
    this.tryUpdate(this);
};

StatusViewAssistant.prototype.deactivate = function(event) {
    this.status.removeListModel(this.status);
};

StatusViewAssistant.prototype.cleanup = function(event) {
    this.controller.stopListening("statusListWidget",
                                 Mojo.Event.listTap, this.showStatusHandler);
};

StatusViewAssistant.prototype.showStatus = function(event) {
    Mojo.Controller.stageController.pushScene("statusDetails", this.status, event.index);
};

StatusViewAssistant.prototype.updateStatus = function(response) {
    if (response.isInternetConnectionAvailable == true) {
        this.status.updateStatus(this);
    } else {
        this.notifyNoNet();
    }
};

StatusViewAssistant.prototype.tryUpdate = function(event) {
    this.controller.serviceRequest('palm://com.palm.connectionmanager', {
        method: 'getstatus',
        parameters: {},
        onSuccess: this.updateStatus.bind(this),
        onFailure: this.notifyNoNet.bind(this)
    });
    this.controller.get("statusListBanner").innerHTML = "<p>Fetching status...</p>";
};

StatusViewAssistant.prototype.notifyNoNet = function(event) {
    this.controller.get("statusListBanner").innerHTML = "<p>No internet connection is available to update tube status.</p>";
};

/* Status model uses the following two methods to update the view regarding
 * success of the status update.
 */
StatusViewAssistant.prototype.notifyFail = function() {
    this.controller.get("statusListBanner").innerHTML = "<p>Updating tube status failed, please try again later.</p>";
};

StatusViewAssistant.prototype.notifySuccess = function() {
    this.controller.get("statusListBanner").hide();
    this.controller.get("statusListMain").show();
};

StatusViewAssistant.prototype.handleCommand = function(event) {
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
        case "do-tubeMap":
            stageController.swapScene("mainView", this.status);
            break;
        case "do-updateStatus":
            this.tryUpdate();
            break;
      }
  }
};
