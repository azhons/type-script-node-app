if (typeof String.prototype.startsWith !== 'function') {
    String.prototype.startsWith = function (str) {
        if (!str)
        {
            return false;
        }

        return this.indexOf(str) === 0;
    };
}

if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function (str) {
        if (!str || str.length > this.length)
        {
            return false;
        }

        return this.lastIndexOf(str) === (this.length - str.length);
    };
}

if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function () { return this.replace(/^\s+|\s+$/g, ''); };
}