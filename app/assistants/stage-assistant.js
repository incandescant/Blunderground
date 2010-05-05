function StageAssistant() {
}

StageAssistant.prototype.setup = function() {
    this.status = new Status();

    this.controller.pushScene("mainView", this.status);
};
