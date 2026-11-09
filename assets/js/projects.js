// Projects page: one project open at a time, and links from the homepage open the right one.
(function () {
    var projects = Array.prototype.slice.call(document.querySelectorAll('details.project'));

    function openFromLink() {
        var id = decodeURIComponent(location.hash.slice(1));
        var target = id ? document.getElementById(id) : null;
        if (!target || projects.indexOf(target) === -1) return;
        target.open = true;
        projects.forEach(function (project) {
            if (project !== target) project.open = false;
        });
        target.scrollIntoView();
    }

    projects.forEach(function (project) {
        project.addEventListener('toggle', function () {
            if (!project.open) return;
            projects.forEach(function (other) {
                if (other !== project) other.open = false;
            });
            // Closing a long project above can push this one off the screen
            if (project.getBoundingClientRect().top < 0) project.scrollIntoView();
        });
    });

    window.addEventListener('hashchange', openFromLink);
    openFromLink();
}());
