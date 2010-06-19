/*
 * Class for fetching tube status by parsing an RSS feed from tubeupdates.com
 * This code is cribbed heavily from the Feeds class from the Palm News sample
 * app from the WebOS O'Reilly book.
 */

var Status = Class.create ({
    initialize: function() {
        this.list = [];
        this.statusUrl = "http://api.tubeupdates.com";
        this.lastUpdated = "";
    },

    updateStatus: function() {
        Mojo.Log.info("Fetching tube status from " + this.statusUrl);

        var request = new Ajax.Request(this.statusUrl, {
            method: "get",
            evalJSON: "false",
            parameters: "method=get.status&lines=all&format=xml",
            onSuccess: this.updateStatusSuccess.bind(this),
            onFailure: this.updateStatusFailure.bind(this)
        });
    },

    updateStatusFailure: function(transport) {
        var t = new Template("Status fetch failed with #{status}.");
        var m = new t.evaluate(transport);

        Mojo.Log.info(m);
        this.listAssistant.notifyFail();
    },

    updateStatusSuccess: function(transport) {
        Mojo.Log.info("Success");
        this.listAssistant.notifySuccess();

        // work around occasional XML errors
        if (transport.responseXML == null && transport.responseText !== null) {
            Mojo.log.info("Request not XML, converting");
            transport.responseXML = new DOMParser().parseFromString(
                transport.responseText, "text/xml");
        }

        this.processStatus(transport);

        this.updateListModel();
        this.statusListChanged = true;
    },

    processStatus: function(transport) {
        var lines = $(transport.responseXML).getElementsByTagName("line");
        var stati = [];
        Mojo.Log.info("Processing status");

        /*
         * Iterate the returned lines XML and pull out the data into our
         * this.list
         */
        for (var i = 0; i < lines.length; i++) {
            var s = lines[i].getElementsByTagName("status").item(0).textContent;
            var d = lines[i].getElementsByTagName("messages").item(0).textContent.gsub('\t', '');
            if (d.length < 1)
                d = "";

            stati[i] = {
                line:lines[i].getElementsByTagName("name").item(0).textContent,
                status:s.camelize(),
                style:s.gsub(' ', '-'),
                details:d
            };

            //Mojo.Log.info(stati[i].style);
            /* Sometimes multiple stati are returned, use only the first.
             * TODO: Iterate the list and show the most severe?
             */
            stati[i].style = stati[i].style.split(',')[0];
            /* Sanitise some statuses, we only have three "styles" */
            switch (stati[i].style)
            {
                case "planned-closure":
                stati[i].style = "bad-service";
                break;
                case "severe-delays":
                case "part-suspended":
                case "minor-delays":
                stati[i].style = "part-closure";
                break;
                // this seems weird, but I've seen it in a live feed
                case "home":
                stati[i].style = "unknown";
                break;
            }
        }

        // Set the last update
        this.list = stati;
        this.lastUpdate = new Date();
    },

    registerListModel: function(sceneAssistant) {
        Mojo.Log.info("Model Registered");
        this.listAssistant = sceneAssistant;
    },

    removeListModel: function() {
        Mojo.Log.info("Model Removed");
        this.listAssistant = undefined;
    },

    updateListModel: function() {
        Mojo.Log.info("Model Updated");
        if (this.listAssistant !== undefined) {
            this.listAssistant.statusListModel.items = this.list;
            this.listAssistant.controller.modelChanged(this.listAssistant.statusListModel, this);
        }
    }
});
