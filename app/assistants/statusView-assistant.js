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
            {label: "Update Status", command: "do-updateStatus"}
        ]
    };
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
            this.status.updateStatus();
            break;
      }
  }
};
