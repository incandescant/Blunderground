/*
 * Class for fetching tube status by parsing an RSS feed from tubeupdates.com
 * This code is cribbed heavily from the Feeds class from the Palm News sample
 * app from the WebOS O'Reilly book.
 */

var Status = Class.create ({
    emptyList: [
        {
            line:"bakerloo",
            status:"unknown",
            details:"none"
        },
        {
            line:"central",
            status:"unknown",
            details:"none"
        },
        {
            line:"circle",
            status:"unknown",
            details:"none"
        },
        {
            line:"district",
            status:"unknown",
            details:"none"
        },
        {
            line:"hammersmith & city",
            status:"unknown",
            details:"none"
        },
        {
            line:"jubilee",
            status:"unknown",
            details:"none"
        },
        {
            line:"metropolitan",
            status:"unknown",
            details:"none"
        },
        {
            line:"northern",
            status:"unknown",
            details:"none"
        },
        {
            line:"picadilly",
            status:"unknown",
            details:"none"
        },
        {
            line:"victoria",
            status:"unknown",
            details:"none"
        },
        {
            line:"waterloo & city",
            status:"unknown",
            details:"none"
        }
    ],

    initialize: function() {
        this.list = this.emptyList;
        this.statusUrl = "http://tubeupdates.com/rss/all.xml";
        this.lastUpdated = "";
    },

    updateStatus: function() {
        Mojo.Log.info("Fetching tube status");

        var request = new Ajax.request(this.statusUrl, {
            method: "get",
            evalJSON: "false",
            onSuccess: this.updateStatusSuccess.bind(this),
            onFailure: this.updateStatusFailure.bind(this)
        });
    },

    updateStatusFailure: function(transport) {
        var t = new Template("Status fetch failed with #{status}.");
        var m = new t.evaluate(transport);

        Mojo.Log.info(m);
    }//,

    // updateStatusSuccess: function(transport) {
    //     Mojo.Log.info("Status fetched, now to process");

    //     // work around occasional XML errors
    //     if (transport.responseXML == null && transport.responseText !== null) {
    //         Mojo.log.info("Request not XML, converting");
    //         transport.responseXML = new DOMParser().parseFromString
    //         (transport.responseText, "text/xml");
    //     }

    //     this.processStatus(transport);
    // },

    // processStatus: function(trasnport) {
    //     var statusList = [];
    //     var items = transport.responseXML.getElementsByTagName("item");
    //     for (i=0;i<items.length; i++) {
    //         statusList[i] = {
    //             title: unescape(items[i].getElementByTagName("title").item(0).textContent),
    //             text: items[i].getElementsByTagName("description").item(0).textContent,
    //             url: items[i].getElementsByTagName("link").item(0).textContent
    //         };
    //     }

    //     /*
    //      * Iterate items and pull the line name, status and details out and
    //      * update this.list with line, status and details
    //      * Need to process title for line and status, details are in description
    //      */

    //     // Set the last update
    //     this.lastUpdate = new Date();
    // }
});
