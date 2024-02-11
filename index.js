// Removes #title to stop playing animations repeatedly
function removeAnchor() {
    let url = document.URL;
    let anchors = url.split('#');
    if (anchors.length <= 1) return;
    if (anchors[1] === 'title') {
        setTimeout(() => {
            history.replaceState(null, '', './')
        }, 2000);
    }
}

removeAnchor();
