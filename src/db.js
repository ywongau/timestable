const promisify = request => new Promise((resolve, reject) => {
    request.onsuccess = function (event) {
        resolve(event.target.result);
    };
    request.onerror = reject
});

const closeDb = db => result => {
    db.close();
    return result;
};

export default idb => {
    const open = (name) => {
        const request = idb.open(name);
        request.onupgradeneeded = () => {
            request.result.createObjectStore('records', { keyPath: 'id', autoIncrement: true });
        }
        return promisify(request);
    };
    const put = x => db => promisify(db.transaction('records', 'readwrite')
        .objectStore('records').put(x)).then(closeDb(db));

    const addRecord = x => open('records')
        .then(put(x));

    const getRecords = () => open('records')
        .then(db => promisify(
            db.transaction('records').objectStore('records').getAll())
            .then(closeDb(db)));

    const deleteRecords = () => promisify(idb.deleteDatabase('records'));

    return {
        addRecord,
        getRecords,
        deleteRecords
    }
}