function StatusViewAssistant() {
}

StatusViewAssistant.prototype.setup = function() {
    this.controller.setupWidget(Mojo.Menu.appMenu,
                                this.attributes = {
                                    omitDefaultItems: true
                                },
                                this.model = {
                                    visible: true,
                                    items: [
                                        { label: "About Blunderground...",
                                          command: "do-aboutBlunderground"},
                                        { label: "Tube Map",
                                          command: "do-tubeMap"}
                                    ]
                                }
                                );
};

StatusViewAssistant.prototype.activate = function(event) {

};

StatusViewAssistant.prototype.deactivate = function(event) {

};

StatusViewAssistant.prototype.cleanup = function(event) {

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
            stageController.swapScene("mainView");
            break;
      }
  }
};
