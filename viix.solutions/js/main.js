(function ($) {
    "use strict";

    function hideSpinner() {
        var $spinner = $("#spinner");
        if ($spinner.length) {
            $spinner.removeClass("show");
        }
    }

    // Spinner — always clear, even if later plugins throw
    setTimeout(hideSpinner, 1);
    $(window).on("load", hideSpinner);

    // Initiate the wowjs (optional — content stays visible via CSS fallback)
    try {
        if (typeof WOW !== "undefined") {
            new WOW().init();
        }
    } catch (e) {
        // ignore
    }

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $(".navbar").addClass("sticky-top shadow-sm");
        } else {
            $(".navbar").removeClass("sticky-top shadow-sm");
        }
    });

    // Dropdown on mouse hover
    var $dropdown = $(".dropdown");
    var $dropdownToggle = $(".dropdown-toggle");
    var $dropdownMenu = $(".dropdown-menu");
    var showClass = "show";

    $(window).on("load resize", function () {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
                function () {
                    var $this = $(this);
                    $this.addClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "true");
                    $this.find($dropdownMenu).addClass(showClass);
                },
                function () {
                    var $this = $(this);
                    $this.removeClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "false");
                    $this.find($dropdownMenu).removeClass(showClass);
                }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });

    // Facts counter
    try {
        if ($.fn.counterUp) {
            $('[data-toggle="counter-up"]').counterUp({
                delay: 10,
                time: 2000,
            });
        }
    } catch (e) {
        // ignore
    }

    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $(".back-to-top").fadeIn("slow");
        } else {
            $(".back-to-top").fadeOut("slow");
        }
    });
    $(".back-to-top").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
        return false;
    });

    // Testimonials carousel (Startup template — multi-item)
    try {
        if ($.fn.owlCarousel && $(".testimonial-carousel").length) {
            $(".testimonial-carousel").owlCarousel({
                autoplay: true,
                smartSpeed: 1500,
                dots: true,
                loop: true,
                center: true,
                responsive: {
                    0: { items: 1 },
                    576: { items: 1 },
                    768: { items: 2 },
                    992: { items: 3 },
                },
            });
        }
    } catch (e) {
        // ignore
    }

    // Legacy testimonials carousel (VIIXSolutions.old — one quote at a time)
    try {
        if ($.fn.owlCarousel && $(".testimonials-carousel").length) {
            $(".testimonials-carousel").owlCarousel({
                autoplay: true,
                dots: true,
                loop: true,
                items: 1,
                smartSpeed: 800,
            });
        }
    } catch (e) {
        // ignore
    }

    // Vendor carousel
    try {
        if ($.fn.owlCarousel && $(".vendor-carousel").length) {
            $(".vendor-carousel").owlCarousel({
                loop: true,
                margin: 45,
                dots: false,
                autoplay: true,
                smartSpeed: 1000,
                responsive: {
                    0: { items: 2 },
                    576: { items: 4 },
                    768: { items: 6 },
                    992: { items: 8 },
                },
            });
        }
    } catch (e) {
        // ignore
    }
    // Hero video fallback → carousel-1 image underneath
    (function () {
        var banner = document.getElementById("hero-banner");
        if (!banner) return;
        var video = banner.querySelector(".hero-video");
        if (!video) return;
        function useFallback() {
            banner.classList.add("is-fallback");
        }
        video.addEventListener("error", useFallback);
        var source = video.querySelector("source");
        if (source) source.addEventListener("error", useFallback);
    })();

    // Service showcase filters (legacy portfolio pattern)
    $(".portfolio-filters").on("click", "li", function () {
        var $btn = $(this);
        var filter = $btn.data("filter") || "*";
        $btn.addClass("filter-active").siblings().removeClass("filter-active");
        var $items = $btn.closest(".service-showcase, .container, section").find(".portfolio-item");
        if (!$items.length) {
            $items = $(".portfolio-item");
        }
        if (filter === "*") {
            $items.removeClass("is-hidden");
        } else {
            $items.each(function () {
                var $item = $(this);
                if ($item.is(filter)) {
                    $item.removeClass("is-hidden");
                } else {
                    $item.addClass("is-hidden");
                }
            });
        }
    });

})(jQuery);

// Last-resort spinner clear if jQuery never loaded
window.addEventListener("load", function () {
    var el = document.getElementById("spinner");
    if (el) el.classList.remove("show");
});
