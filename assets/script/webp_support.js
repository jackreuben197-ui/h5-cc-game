if (cc.sys.isBrowser && cc.sys.os === cc.sys.OS_IOS) {
        function checkSupport(cb) {
            var webP = new Image();
            webP.onload = webP.onerror = function () {
                let isSupported = (webP.height === 2);
                cb(isSupported);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        }

        checkSupport(function (result) {
            cc.sys.capabilities.webp = result;  // overwrite
        });
    }