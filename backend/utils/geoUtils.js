function createBBox(lat, lng, size = 0.03) {
    return [
        lng - size,
        lat - size,
        lng + size,
        lat + size
    ].join(",");
}

module.exports = { createBBox };
