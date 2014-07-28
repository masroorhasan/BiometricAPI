var connections = {};
module.exports = {
    goodImage: function(sock) {
        connections[sock.id] = {
            counter: 0,
            last_modified: new Date(),
	    flagging: false
        };
	// TODO: how to clear the flag timer?

    },
    badImage: function(sock) {
        if (!connections[sock.id]) {
            connections[sock.id] = {
                counter: 0,
                last_modified: new Date(),
		flagging: false
            };
        }

	connections[sock.id].counter++;
	connections[sock.id].last_modified = new Date();

	// if we've gotten more than 4 bad in a row
	// send a preflag event
	if(connections[sock.id].last_modified >= 4 && !connections[sock.id].flagging) {
		sock.emit('preFlag');
	}
    }
};
