const FETCH_OPTS = {mode: 'no-cors', cache: 'no-cache'};

const privacyListener = {
    id: 'privacy',
    services: [
        {url: 'http://127.0.0.1:9050', name: 'Tor Daemon'},
        {url: 'http://127.0.0.1:9051', name: 'Tor Daemon'},
        {url: 'http://127.0.0.1:9150', name: 'Tor Browser'},
        {url: 'http://127.0.0.1:9151', name: 'Tor Browser'},
        {url: 'http://127.0.0.1:9350', name: 'Brave Browser Tor Mode'},
    ],
    detected: [],
};

const gamesListener = {
    id: 'games',
    services: [
        {url: 'http://127.0.0.1:27060', name: 'Steam'},
    ],
    detected: [],
};

const developerListener = {
    id: 'developer',
    services: [
        {url: 'http://127.0.0.1:3306', name: 'MySQL'},
        {url: 'http://127.0.0.1:6379', name: 'Redis'},
        {url: 'http://127.0.0.1:9200/_cat', name: 'ElasticSearch'},
        {url: 'http://127.0.0.1:27017', name: 'MongoDB'},
    ],
    detected: [],
};

window.onload = () => {
    start(developerListener);
    start(gamesListener);
    start(privacyListener);
};

function start(listener) {
    const loop = async () => {
        await Promise.all(listener.services.map(x => {
            return fetch(x.url, FETCH_OPTS).then(r => {
                if (listener.detected.indexOf(x.name) == -1) {
                    listener.detected.push(x.name);
                }
            }).catch(e => e);
        }));
        if (listener.detected.length === 0) {
            setTimeout(loop, 5000);
        } else {
            const el = document.querySelector('#' + listener.id);
            const name = joinAnd(listener.detected);
            el.querySelector('.name').innerText = name;
            el.className = 'found';
        }
    };
    setTimeout(loop, 0);
}

function joinAnd(lst) {
    if (lst.length == 0) {
        return '';
    } else if (lst.length == 1) {
        return lst[0];
    } else {
        return lst.slice(0, -1).join(', ') + ' and ' + lst[lst.length - 1];
    }
}
