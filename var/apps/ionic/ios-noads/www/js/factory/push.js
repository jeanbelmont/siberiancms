/*global
    App, angular, DEVICE_TYPE
 */

/**
 * Push
 *
 * @author Xtraball SAS
 */
angular.module("starter").factory("Push", function($pwaRequest, $session, SB) {

    var factory = {
        value_id                : null,
        device_type             : DEVICE_TYPE,
        device_token            : null,
        unread_count            : 0,
        extendedOptions         : {}
    };

    /**
     *
     * @param value_id
     */
    factory.setValueId = function(value_id) {
        factory.value_id = value_id;
    };

    /**
     *
     * @param options
     */
    factory.setExtendedOptions = function(options) {
        factory.extendedOptions = options;
    };

    /**
     * Pre-Fetch feature.
     *
     * @param page
     */
    factory.preFetch = function(page) {
        factory.findAll();
    };

    factory.registerAndroidDevice = function(params) {

        $pwaRequest.post("/push/android/registerdevice", {
            data    : angular.extend(params, {
                device_uid: $session.getDeviceUid()
            }),
            cache   : false
        });

    };

    factory.registerIosDevice = function(params) {

        $pwaRequest.post("/push/iphone/registerdevice", {
            data    : angular.extend(params, {
                device_uid: $session.getDeviceUid()
            }),
            cache   : false
        });

    };

    factory.findAll = function(offset, refresh) {

        if(!this.value_id) {
            $pwaRequest.reject("[Factory::Push.findAll] missing value_id");
        }

        return $pwaRequest.get("push/mobile_list/findall", angular.extend({
            urlParams: {
                value_id    : this.value_id,
                device_uid  : $session.getDeviceUid(),
                offset      : offset
            },
            refresh: refresh
        }, factory.extendedOptions));

    };

    /**
     * updateUnreadCount
     */
    factory.updateUnreadCount = function() {

        /** Move then to controller/events */
        return $pwaRequest.get("push/mobile/count", {
            urlParams: {
                device_uid: $session.getDeviceUid()
            }
        });
    };

    factory.getInAppMessages = function() {

        return $pwaRequest.get("push/mobile/inapp", {
            urlParams: {
                device_uid: $session.getDeviceUid()
            }
        });

    };

    factory.getLastMessages = function() {

        return $pwaRequest.get("push/mobile/lastmessages", {
            urlParams: {
                device_uid: $session.getDeviceUid()
            }
        });
    };

    /**
     * Mark in-app message as read.
     *
     */
    factory.markInAppAsRead = function() {

        return $pwaRequest.get("push/mobile/readinapp", {
            urlParams: {
                device_uid  : $session.getDeviceUid(),
                device_type : factory.device_type
            },
            cache: false
        });
    };

    /**
     * Mark push message as read.
     *
     * @param message_id
     */
    factory.markAsDisplayed = function(message_id) {

        var url = "";
        switch(factory.device_type) {
            case SB.DEVICE.TYPE_ANDROID:
                    url = "push/android/markdisplayed";
                break;
            case SB.DEVICE.TYPE_IOS:
                    url = "push/iphone/markdisplayed";
                break;
            default:
                return $pwaRequest.reject();
        }

        return $pwaRequest.get(url, {
            data: {
                device_uid: $session.getDeviceUid(),
                message_id: message_id
            },
            cache: false
        });
    };

    return factory;
});
