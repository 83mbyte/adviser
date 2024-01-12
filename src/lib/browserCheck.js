const browserCheck = () => {
    const BROWSERS = [
        ["aol", /AOLShield\/([0-9\._]+)/],
        ["edge", /Edge\/([0-9\._]+)/],
        ["edge-ios", /EdgiOS\/([0-9\._]+)/],
        ["yandexbrowser", /YaBrowser\/([0-9\._]+)/],
        ["kakaotalk", /KAKAOTALK\s([0-9\.]+)/],
        ["samsung", /SamsungBrowser\/([0-9\.]+)/],
        ["silk", /\bSilk\/([0-9._-]+)\b/],
        ["miui", /MiuiBrowser\/([0-9\.]+)$/],
        ["beaker", /BeakerBrowser\/([0-9\.]+)/],
        ["edge-chromium", /EdgA?\/([0-9\.]+)/],
        [
            "chromium-webview",
            /(?!Chrom.*OPR)wv\).*Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/,
        ],
        ["chrome", /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
        ["phantomjs", /PhantomJS\/([0-9\.]+)(:?\s|$)/],
        ["crios", /CriOS\/([0-9\.]+)(:?\s|$)/],
        ["firefox", /Firefox\/([0-9\.]+)(?:\s|$)/],
        ["fxios", /FxiOS\/([0-9\.]+)/],
        ["opera-mini", /Opera Mini.*Version\/([0-9\.]+)/],
        ["opera", /Opera\/([0-9\.]+)(?:\s|$)/],
        ["opera", /OPR\/([0-9\.]+)(:?\s|$)/],
        ["pie", /^Microsoft Pocket Internet Explorer\/(\d+\.\d+)$/],
        ["netfront", /^Mozilla\/\d\.\d+.*NetFront\/(\d.\d)/],
        ["ie", /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],
        ["ie", /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
        ["ie", /MSIE\s(7\.0)/],
        ["bb10", /BB10;\sTouch.*Version\/([0-9\.]+)/],
        ["android", /Android\s([0-9\.]+)/],
        ["ios", /Version\/([0-9\._]+).*Mobile.*Safari.*/],
        ["safari", /Version\/([0-9\._]+).*Safari/],
        ["facebook", /FB[AS]V\/([0-9\.]+)/],
        ["instagram", /Instagram\s([0-9\.]+)/],
        ["ios-webview", /AppleWebKit\/([0-9\.]+).*Mobile/],
        ["ios-webview", /AppleWebKit\/([0-9\.]+).*Gecko\)$/],
    ];
    const ALLOWED_VERSIONS = {
        chrome: 32.0,
        firefox: 65.0,
        safari: 14.0,
        opera: 12.1,
        edge: 18.0,
    };

    const nav = navigator.userAgent;
    let userEnv = {};
    for (let key in Object.keys(BROWSERS)) {
        let matched = nav.match(BROWSERS[key][1]);
        if (matched) {
            userEnv = {
                ...userEnv,
                browser: BROWSERS[key][0],
                version: matched,
            };
            let versionSplitToArray = userEnv.version[1].split(".");
            if (versionSplitToArray.length > 1) {
                userEnv = {
                    ...userEnv,
                    version: Number(
                        versionSplitToArray[0] + "." + versionSplitToArray[1]
                    ),
                };
            } else {
                userEnv = {
                    ...userEnv,
                    version: Number(versionSplitToArray[0]),
                };
            }
            if (userEnv.version < ALLOWED_VERSIONS[userEnv.browser]) {
                console.error("Your web browser version is outdated.");

                return { message: "Your web browser version is outdated.", notice: { status: true, type: null } }

            }
            else if (userEnv.browser === 'safari') {
                let osVersion = nav.match(/(Mac OS X)\s([0-9]+_[0-9]+_[0-9]+)/)[2];
                if (Number(osVersion.split('_')[0]) < 11) {
                    console.error("Your operating system is not compatible with displaying images in Safari browser.");
                    return { message: "Your operating system is not compatible with displaying images in Safari browser.", notice: { status: true, type: 'osOutdated' } }


                }
            }
            else {
                console.log("Successful browser compatibility check.");
                return { message: "Successful browser compatibility check.", notice: null }
            }
            break;
        }
    }
}

export default browserCheck;