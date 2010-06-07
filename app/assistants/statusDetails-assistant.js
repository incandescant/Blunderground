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
