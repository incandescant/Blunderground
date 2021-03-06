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

function StatusDetailsAssistant(status, statusIndex) {
    this.status = status;
    this.statusIndex = statusIndex;
}

StatusDetailsAssistant.prototype.setup = function() {
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

    var detailsTitleElement = this.controller.get("detailsViewTitle");
    var detailsSummaryElement = this.controller.get("detailsViewSummary");
    var detailsStatusElement = this.controller.get("detailsViewStatus");
    detailsTitleElement.innerHTML = this.status.list[this.statusIndex].line;
    detailsStatusElement.innerHTML = this.status.list[this.statusIndex].status;
    detailsSummaryElement.innerHTML = this.status.list[this.statusIndex].details;
};

StatusDetailsAssistant.prototype.activate = function(event) {
};

StatusDetailsAssistant.prototype.deactivate = function(event) {
};

StatusDetailsAssistant.prototype.cleanup = function(event) {
};

StatusDetailsAssistant.prototype.handleCommand = function(event) {
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
      }
  }
};
