define(["require", "exports", '../config'], function (require, exports, app) {
    angular.module(app.name).directive('formatTime', getFormatTimeDirective);
    function formatDate(time) {
        var date = new Date(time);
        if (date) {
            return formatNumber(date.getHours()) + ":" + formatNumber(date.getMinutes());
        }
        return "";
    }
    function formatNumber(part) {
        return part < 10 ? "0" + part : "" + part;
    }
    function getFormatTimeDirective() {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs, ngSelect) {
                var time = parseInt(attrs.formatTime);
                time && elem.text(formatDate(time));
            }
        };
    }
});
//# sourceMappingURL=formatTimeDirective.js.map