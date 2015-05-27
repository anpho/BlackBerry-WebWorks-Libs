var LS = {
    put: function(key, value) {
        if (value instanceof Object) {
            LocalStorage.setItem(key, JSON.stringify(value));
        } else {
            LocalStorage.setItem(key, value);
        }
    },
    get: function(key) {
        var result = LocalStorage.getItem(key);
        if (result === null) {
            return null;
        } else {
            try {
                var json = JSON.parse(result);
                return json;
            } catch (e) {
                return result;
            }
        }
    }
};
var SS = {
    put: function(key, value) {
        if (value instanceof Object) {
            SessionStorage.setItem(key, JSON.stringify(value));
        } else {
            SessionStorage.setItem(key, value);
        }
    },
    get: function(key) {
        var result = SessionStorage.getItem(key);
        if (result === null) {
            return null;
        } else {
            try {
                var json = JSON.parse(result);
                return json;
            } catch (e) {
                return result;
            }
        }
    }
}