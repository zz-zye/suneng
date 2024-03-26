async function get_html(url) {
    let response = await fetch(url, { method: 'get' });
    if (response.status !== 200) {
        console.log(response);
        throw 'No page found';
    }
    let text = await response.text();
    return text;
}

// global var storing page
let current_page = 1;
const page_max = 2;

function disable_buttons() {
    if (current_page <= 1) {
        document.getElementById('prev').disabled = true;
    } else {
        document.getElementById('prev').disabled = false;
    }
    if (current_page >= page_max) {
        document.getElementById('next').disabled = true;
    } else {
        document.getElementById('next').disabled = false;
    }
}

async function goto_page(new_page) {
    // Fetch the new content
    let innerHTML = await get_html(`./${new_page}.html`);
    if (innerHTML === undefined) {
        // TODO: return to default page
        throw `No page found: ${new_page}.html`;
    }

    // Fade out the existing content
    const content = document.getElementById('content');
    content.classList.add('opacity-0');
    
    content.ontransitionend = () => {
        // When fade-out is done, fade-in the new content
        content.innerHTML = innerHTML;
        content.classList.remove('opacity-0');
        content.ontransitionend = () => {};
    };
}

async function goto_next() {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    
    let new_page = 2;
    if (params.has('page')) {
        new_page = Number(params.get('page')) + 1;
        if (new_page > page_max) {
            new_page = page_max;
        }
    }

    if (current_page !== new_page) {    
        await goto_page(new_page);
        current_page = new_page;
        params.set('page', current_page.toString());
        history.pushState({}, '', url.toString());
        
        disable_buttons();
    }
}
document.getElementById('next').onclick = goto_next;

async function goto_prev() {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    
    let new_page = 1;
    if (params.has('page')) {
        new_page = Number(params.get('page')) - 1;
        if (new_page < 1) {
            new_page = 1;
        }
    }

    if (current_page !== new_page) {    
        await goto_page(new_page);
        current_page = new_page;
        params.set('page', current_page.toString());
        history.pushState({}, '', url.toString());

        disable_buttons();
    }
}
document.getElementById('prev').onclick = goto_prev;

async function goto_current() {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    
    let new_page = 1;
    if (params.has('page')) {
        new_page = Number(params.get('page'));
    }

    if (current_page !== new_page) {
        await goto_page(new_page);
        current_page = new_page
    }
    
    disable_buttons();
}

window.addEventListener("popstate", (e) => {
    goto_current();
});

window.addEventListener("load", (e) => {
    goto_current();
});



