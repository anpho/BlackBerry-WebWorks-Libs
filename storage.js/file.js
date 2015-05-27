var fu = {
    saveToLocalAsync: function(url, callback, onprogress, headers) {
        //download remote file to local.
        /*
         * can use to fetch json data or post GET requests.
         */
        var ft = new FileTransfer();
        if (typeof (onprogress) === 'funciton') {
            ft.onprogress = onprogress;
        }
        ;
        ft.download(url, this.buildLocalUrl(url), function(succ) {
            //saved,succ.nativeEntry is the fileEntry.
            console.log(succ);
            if (typeof (callback) === 'function') {
                callback(succ.nativeEntry);
            }
        }, function(err) {
            console.log(err);
            if (typeof (callback) === 'function') {
                callback(err.body);
            }
        }, true, headers);

    },
    buildLocalUrl: function(url) {
        /*
         * to build a temp url in app folder.
         */
        return blackberry.io.home + '/' + btoa(url);
    },
    readLocalFileContentAsync: function(fileobj, callback, encoding, onprogress) {
        /*
         * Reads a File object with encoding ( default utf-8 ).
         */
        var fr = new FileReader();
        if (typeof (onprogress) === 'function') {
            fr.onprogress = onprogress;
        }
        fr.onloadend = function(e) {
            console.log(e);
            callback(e.target.result);
        }
        fr.onerror = function(e) {
            console.log(e);
            callback(null);
        }
        if (encoding) {
            fr.readAsText(fileobj, encoding);
        } else {
            fr.readAsText(fileobj);
        }

    },
    getFileObjFromFileEntryAsync: function(fileEntry, callback) {
        /*
         * Get the File object from the given FileEntry object.
         */
        if (fileEntry) {
            fileEntry.file(function(succ) {
                console.log('Got File Object : ' + succ);
                callback(succ);
            }, function(err) {
                console.error('Getting File Object/' + err);
                callback(null);
            })
        } else {
            callback(null);
        }
    },
    getFileSizeOfFileObj: function(fileObj) {
        /*
         * get file size.
         */
        return fileObj.size;
    },
    getFilePartAsFile: function(fileobj, start, length) {
        /*
         * slice a file into small parts.
         */
        return fileobj.slice(start, start + length);
    },
    removeFile: function(fileEntry) {
        /*
         * remove file by param fileEntry object.
         */
        fileEntry.remove(function(succ) {
            console.log('removed:' + succ);
        }, function(error) {
            console.log(error);
        });
    },
    removeFileByURL: function(url) {
        /*
         * Remove file by the param url
         */
        window.resolveLocalFileSystemURI(url, function(succ) {
            fu.removeFile(succ.nativeEntry);
        }, function(error) {
            console.log(error);
        })
    },
    getFileEntryViaURLAsync: function(url, callback) {
        /*
         * Get FileEntry object by the param url.
         */
        window.resolveLocalFileSystemURI(url, function(succ) {
            callback(succ.nativeEntry);
        }, function(error) {
            console.log(error);
            callback(null);
        })
    }
};
var curl = {
    get: function(url, callback, encoding) {
        this.getAndRead(url, function(data) {
            curl.rmFromCache(fu.buildLocalUrl(url));
            callback(data);
        }, encoding);
    },
    getAndRead: function(url, callback, encoding) {
        /*
         * get file from url with encoding then read its content.
         */
        fu.saveToLocalAsync(url, function(fileEntry) {
            if (fileEntry) {
                fu.getFileObjFromFileEntryAsync(fileEntry, function(fileobj) {
                    if (fileobj) {
                        fu.readLocalFileContentAsync(fileobj, function(content) {
                            callback(content);
                        }, encoding)
                    } else {
                        callback(null);
                    }
                });
            } else {
                callback(null);
            }
        })
    },
    rmFromCache: function(url) {
        /*
         * remove a local file 
         */
        fu.removeFileByURL(url);
    }
};