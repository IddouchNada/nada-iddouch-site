// Swipeable project timeline. The slides can still be swiped without this script.
(function () {
    var root = document.querySelector('[data-slider]');
    if (!root) return;

    var track = root.querySelector('.track');
    var slides = Array.prototype.slice.call(track.querySelectorAll('.slide'));
    var ticks = Array.prototype.slice.call(root.querySelectorAll('.rail li'));
    var count = root.querySelector('[data-count]');
    var hint = root.querySelector('[data-hint]');
    var prev = root.querySelector('[data-prev]');
    var next = root.querySelector('[data-next]');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var current = -1;

    function position(index) {
        return slides[index].offsetLeft - parseFloat(getComputedStyle(track).paddingLeft);
    }

    function nearest() {
        var best = 0;
        var bestDistance = Infinity;
        slides.forEach(function (slide, index) {
            var distance = Math.abs(position(index) - track.scrollLeft);
            if (distance < bestDistance) {
                bestDistance = distance;
                best = index;
            }
        });
        return best;
    }

    function show(index) {
        if (index === current) return;
        if (current !== -1 && hint) hint.classList.add('gone');
        current = index;
        slides.forEach(function (slide, i) {
            slide.classList.toggle('is-on', i === index);
        });
        ticks.forEach(function (tick, i) {
            tick.classList.toggle('is-done', i <= index);
            tick.classList.toggle('is-on', i === index);
            if (i === index) {
                tick.firstElementChild.setAttribute('aria-current', 'step');
            } else {
                tick.firstElementChild.removeAttribute('aria-current');
            }
        });
        count.textContent = ('0' + (index + 1)).slice(-2);
        prev.disabled = index === 0;
        next.disabled = index === slides.length - 1;
    }

    function go(index) {
        track.scrollTo({ left: position(index), behavior: reduceMotion ? 'auto' : 'smooth' });
    }

    track.addEventListener('scroll', function () { show(nearest()); }, { passive: true });
    window.addEventListener('resize', function () { show(nearest()); });
    prev.addEventListener('click', function () { go(Math.max(current - 1, 0)); });
    next.addEventListener('click', function () { go(Math.min(current + 1, slides.length - 1)); });
    ticks.forEach(function (tick, index) {
        tick.firstElementChild.addEventListener('click', function () { go(index); });
    });

    show(nearest());
    track.classList.add('ready');

    // A small movement the first time the slider is seen, to show it can be swiped
    if (!reduceMotion && 'IntersectionObserver' in window) {
        var seen = new IntersectionObserver(function (entries) {
            if (!entries[0].isIntersecting) return;
            seen.disconnect();
            track.classList.add('nudge');
        }, { threshold: 0.5 });
        seen.observe(track);
    }
}());
