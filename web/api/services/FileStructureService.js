module.exports = {
    createDir: function(pathname) {
        var fs = require('fs');

        if(!fs.existsSync(pathname))
            fs.mkdirSync(pathname);

        return;
    },

    readDir: function(path, cb) {
        var path = require('path');
        var fs = require('fs');
        
        // var filepath = "../../assets/";
        var dbfilepath = "../../assets/db/";
        var path_db = path.resolve(__dirname, dbfilepath);

        var userpath_db = path.resolve(__dirname, path_db);
    },

    checkExistsDirSync: function(path) {
        return require('fs').existsSync(path);
    },

    getGlobalYmlDir: function() {
        return FileStructureService.getDbPath() + "/yml";
    },

    getUserDir: function(userid) {
        return FileStructureService.getDbPath() + "/" + userid.toString();
    },

    getAuthDir: function(userid) {
        return FileStructureService.getDbPath() + "/" + userid.toString() + "/auth";
    },

    getSessionsDir: function(userid) {
        return FileStructureService.getDbPath() + "/" + userid.toString() + "/sessions";
    },

    getSessionDirByID: function(userid, sessionid) {
        return FileStructureService.getDbPath() + "/" + userid.toString() + "/sessions/" + sessionid.toString();
    },

    checkGlobalYmlSync: function() {
        return require('fs').existsSync(FileStructureService.getGlobalYmlDir() + "/global.yml");
    },

    getDbPath: function() {
        var path = require('path');
        // TODO
        var dbfilepath = "../../assets/db/";
        var path_db = path.resolve(__dirname, dbfilepath);
        // console.log("createUserDir path_db " + path_db);

        return path_db;
    },

    createGlobalYMLDirSync: function() {
        FileStructureService.createDir(FileStructureService.getGlobalYmlDir());
    },

    createImageDirs: function(dirpath) {
        var path_out = dirpath + "/out";
        FileStructureService.createDir(path_out);

        var path_sample = dirpath + "/sample";
        FileStructureService.createDir(path_sample);

        return;
    },

    createUserDir: function(user_id) {
        // console.log("FS Service.createUserDir");

        var path_user = FileStructureService.getDbPath() + "/" + user_id.toString();
        console.log("FS Service.createUserDir, path_user " + path_user);

        FileStructureService.createDir(path_user);
        
        // Add to User_Image Mapping -> set field: userpath_db
        return;
    },

    createAuthDir: function(user_id) {

        // Get User_Image Mapping -> get field: userpath_db
        
        // createDir('userpath_db/auth', 'user_id', function(error, userpath){
        // 
        // });
        var path_auth = FileStructureService.getDbPath() + "/" + user_id.toString() + "/auth";
        console.log("FS Service.createUserDir, path_auth " + path_auth);

        FileStructureService.createDir(path_auth);

        FileStructureService.createImageDirs(path_auth);
        
        // Add to User_Image Mapping -> set field: authpath_db
        return;
    },

    createSessionsDir: function(user_id) {
        var path_session = FileStructureService.getDbPath() + "/" + user_id.toString() + "/sessions";
        console.log("FS Service.createUserDir, path_session " + path_session);

        FileStructureService.createDir(path_session);

        return;
    },

    createYMLDir: function() {
        var path_yml = FileStructureService.getDbPath() + "/yml";
        console.log("FS Service.createUserDir, path_yml " + path_yml);

        FileStructureService.createDir(path_yml);

        return;
    },

    createSessionDir: function(path, user_id, session_id) {
        // Get User_Image Mapping -> get field: userpath_db
        
        // dirExists('sessions', function(direxists) {
        //      if(!direxists)
        //          // createDir('sessions')
        //          
        //      var sessionpath = sessionspath_db + 'session_id';
        //      createDir(sessionpath);
        // });
        
        // FileStructureService.createImageDirs(path_sessionid);

        return;
    },

    existsFilePathSync: function(filepath) {
        
        if(require('fs').existsSync(filepath))
            return true; 

        return false;
    },

    getFilesRecursiveSync: function (dir, fileList, optionalFilterFunction) {
        
        if (!fileList) {
            grunt.log.error("Variable 'fileList' is undefined or NULL.");
            return;
        }
        var files = require('fs').readdirSync(dir);
        for (var i in files) {
            if (!files.hasOwnProperty(i)) continue;
            var name = dir + '/' + files[i];
            if (require('fs').statSync(name).isDirectory()) {
                getFilesRecursiveSync(name, fileList, optionalFilterFunction);
            } else {
                if (optionalFilterFunction && optionalFilterFunction(name) !== true)
                    continue;

                if(require('path').extname(name) == ".pgm")
                    fileList.push(name);
            }
        }
    }
};