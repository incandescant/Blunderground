function MainViewAssistant() {
}

MainViewAssistant.prototype.setup = function() {
    this.controller.setupWidget("mapScroller", { mode: "free" }, this.mapScrollerModel = {});
};

MainViewAssistant.prototype.activate = function(event) {
};

MainViewAssistant.prototype.deactivate = function(event) {
};

MainViewAssistant.prototype.cleanup = function(event) {
};

/*
// Show the current tube status
MainViewAssistant.prototype.status = function(event) {
  this.controller.stageController.swapScene(
      {
          transition: Mojo.Transition.crossFade,
          name: "mapView"
      }
  );
*/
