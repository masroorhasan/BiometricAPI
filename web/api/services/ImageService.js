var connections = {};
module.exports = {
    goodImage: function(sock, result) {
        connections[sock.id] = {
            counter: 0,
            last_modified: new Date().now(),
	    flagging: false
        };
	// TODO: how to clear the flag timer?

    },
    badImage: function(sock, result) {
        if (!connections[sock.id]) {
            connections[sock.id] = {
                counter: 0,
                last_modified: new Date().now(),
		flagging: false
            };
        }

	connections[sock.id].counter++;
	connections[sock.id].last_modified = new Date().now();

	// if we've gotten more than 4 bad in a row
	// send a preflag event
	if(connections[sock.id].last_modified >= 4 && !connections[sock.id].flagging) {
		sock.emit('preFlag');
	}
    }
};
