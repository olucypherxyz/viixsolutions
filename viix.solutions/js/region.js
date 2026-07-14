/**
 * VIIX region preference (cookie-backed manual override).
 * Geo-IP auto-detect needs an edge/API this static host doesn't provide —
 * implement client-side later (e.g. Cloudflare Workers / geo header).
 */
(function () {
    "use strict";

    var COOKIE = "viix_region";
    var MAX_AGE = 60 * 60 * 24 * 365; // 1 year

    function setCookie(value) {
        document.cookie =
            COOKIE +
            "=" +
            encodeURIComponent(value) +
            "; path=/; max-age=" +
            MAX_AGE +
            "; SameSite=Lax";
    }

    function getCookie() {
        var match = document.cookie.match(
            new RegExp("(?:^|; )" + COOKIE + "=([^;]*)")
        );
        return match ? decodeURIComponent(match[1]) : null;
    }

    function bindLinks() {
        document.querySelectorAll("[data-viix-region]").forEach(function (el) {
            el.addEventListener("click", function () {
                var region = el.getAttribute("data-viix-region");
                if (region) setCookie(region);
            });
        });
    }

    document.addEventListener("DOMContentLoaded", bindLinks);

    // Expose for debugging / future geo redirect
    window.VIIXRegion = {
        get: getCookie,
        set: setCookie,
    };
})();
