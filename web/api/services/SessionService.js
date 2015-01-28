var connections = {};
module.exports = {

    newImageID: function(sock) {
        return SessionService.getConnection(sock).count++;
    },

    getConnection: function(sock) {
        if (!connections[sock.id]) {
            connections[sock.id] = {
                count: 0, // total images
                counter: 0,
                last_modified: new Date(),
                flagging: false
            };
        }
        return connections[sock.id];
    }
};
