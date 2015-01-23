var Session = function(username, session_id) {
    this.username = username;
    this.session_id = session_id;
};

var Sessions = function() {
    /**
     * Session in-memory cache
     * key is the session id
     */
    var $this = this;
    $this.sessions = {};
    $this.next_id = 0;
    $this.newSession = function(username) {
        var id = $this.next_id++;
        var sess = new Session(username, id);
        return sessions[id] = sess;
    };

    $this.getSession = function(session_id) {
        return $this.sessions[session_id] || null;
    };

    $this.updateSession = function(session, session_id) {
        session_id = session_id || session.id;
        $this.sessions[session_id] = session;
        // or use angular.extend?
    };
};

module.exports = {
    login: function(username, image) {
        if(AuthService.authUser(username, image)) {
            return Sessions.newSession(username);
        }
        // try again shit
    },

    authUser: function(username, image) {
        /**
         * authenticate user
         * returns: boolean
         */
        return true;
    },

    logout: function() {

    },

    register: function() {

    }
};
