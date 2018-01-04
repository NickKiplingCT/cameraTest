var PouchManager = (function () {
    function PouchManager() {
        console.log("::initialise:: Starting application. Pouch Manager 0.1.0");
    }
	
	PouchManager.prototype.saveToDatabase = function (recordKey, recordData, onSuccess, onFail) {
	    var pouch = new PouchDB("InfinityPouchManager", {revs_limit: 1, auto_compaction: true});
	    pouch.get(recordKey)
            .then(function (doc) {
                pouch.put({ _id: recordKey, _rev: doc._rev, data: recordData })
                    .then(function (response) {
                        onSuccess(doc._rev);
                    })
                    .catch(function (err) {
                        onFail("Failed to update record", err);
                    });
            })
            .catch(function (err) {
                if (err.status == 404) {
                    pouch.put({ _id: recordKey, data: recordData })
                        .then(function (response) {
                            onSuccess("(new)");
                        })
                        .catch(function (err2) {
                            onFail("Failed to add record", err2);
                        })
                }
                else {
                    onFail("Failed to retrieve record", err);
                }
            })
	}

	PouchManager.prototype.loadFromDatabase = function (recordKey, onSuccess, onFail) {
	    var pouch = new PouchDB("InfinityPouchManager", {revs_limit: 1, auto_compaction: true});
	    pouch.get(recordKey)
            .then(function (doc) {
                onSuccess(doc);
            })
            .catch(function (err) {
                if (err.status == 404) {
                    onFail("Record does not exist", err);
                }
                else {
                    onFail("Failed to retrieve record", err);
                }
            })
	}

	PouchManager.prototype.deleteFromDatabase = function (recordKey, onSuccess, onFail) {
	    var pouch = new PouchDB("InfinityPouchManager", {revs_limit: 1, auto_compaction: true});
	    pouch.get(recordKey)
            .then(function (doc) {
                db.remove(doc._id, doc._rev);
                onSuccess(doc._rev);
            })
            .catch(function (err) {
                if (err.status == 404) {
                    onSuccess("(none)");
                }
                else {
                    onFail("Failed to retrieve record", err);
                }
            })
    }

    return PouchManager;
}());

function startPouchManager() {
    console.log("::initialise::  Starting pouchManager");
	
	window.pouchManager = new PouchManager();
}

if (!window.device) {
    console.log(" ::initialise:: No device, manually start pouchManager");
    window.setTimeout(function () {
		startPouchManager();
    }, 500);
}

document.removeEventListener('deviceready', startPouchManager);
document.addEventListener('deviceready', startPouchManager, true);
