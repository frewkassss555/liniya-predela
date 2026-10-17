(function () {
  document.documentElement.classList.add('js');

  var blocks = document.querySelectorAll('[data-reveal]');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function format(value, decimals) {
    var parts = value.toFixed(decimals).split('.');
    return parts[1] ? parts[0] + '<span class="num__comma">,</span>' + parts[1] : parts[0];
  }

  function count(el) {
    var to = parseFloat(el.dataset.count);
    var from = parseFloat(el.dataset.from || '0');
    var decimals = parseInt(el.dataset.decimals || '0', 10);
    var duration = 1200;
    var start = null;

    function step(time) {
      if (start === null) start = time;
      var p = Math.min((time - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.innerHTML = format(from + (to - from) * eased, decimals);
      if (p < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function reveal(block) {
    block.classList.add('is-drawn');
    Array.prototype.forEach.call(block.querySelectorAll('[data-count]'), count);
  }

  if (reduce || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(blocks, function (block) {
      block.classList.add('is-drawn');
    });
    return;
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-count]'), function (el) {
    el.innerHTML = format(parseFloat(el.dataset.from || '0'), parseInt(el.dataset.decimals || '0', 10));
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      reveal(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.35 });

  Array.prototype.forEach.call(blocks, function (block) {
    observer.observe(block);
  });
})();
