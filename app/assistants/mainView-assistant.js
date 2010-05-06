function MainViewAssistant(status) {
    this.status = status;
}

MainViewAssistant.prototype.setup = function() {
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
        items: [
            {label: "Tube Status", command: "do-tubeStatus"}
        ]
    };
    this.controller.setupWidget(Mojo.Menu.commandMenu, undefined,
                                this.commandMenuModel);

    this.controller.setupWidget("mapScroller", { mode: "free" },
                                this.mapScrollerModel = {});
};

MainViewAssistant.prototype.activate = function(event) {
};

MainViewAssistant.prototype.deactivate = function(event) {
};

MainViewAssistant.prototype.cleanup = function(event) {
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
      }
  }
};
