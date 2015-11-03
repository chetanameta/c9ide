module.exports = function (manifest, installPath) {

    if (!manifest) {
        manifest = require(__dirname + "/../package.json");
        manifest.revision =
            manifest.revision ||
            require("c9/git").getHeadRevisionSync(__dirname + "/..");
    }

    var path = require("path");
    var os = require("os");
    var runners = require("../plugins/c9.ide.run/runners_list").local;
    /**
     * delete unwanted runners
     */
    delete runners['C (GDB Debugging)'];
    delete runners['C++ (simple)'];
    delete runners['CoffeeScript'];
    delete runners['go'];
    delete runners['io.js'];
    delete runners['Meteor'];
    delete runners['Mocha'];
    delete runners['PHP (built-in web server)'];
    delete runners['Ruby on Rails'];
    delete runners['Ruby'];
    delete runners['Python (interactive mode)'];
    delete runners['Shell command'];
    delete runners['Shell script'];
    /**
     * end unwanted runners
     */
    var builders = require("../plugins/c9.ide.run.build/builders_list");

    /**
     * delete unwanted builders
     */
    delete builders['CoffeeScript'];
    delete builders['less'];
    delete builders['SASS (scss)'];
    delete builders['stylus'];
    delete builders['typescript'];
    /**
     * end unwanted builder
     */

    var workspaceDir = path.resolve(__dirname + "/../");

    //console.log(workspaceDir);
    var sdk = !manifest.sdk;
    var win32 = process.platform == "win32";

    if (win32 && process.env.HOME === undefined) {
        process.env.HOME = process.env.HOMEDRIVE + process.env.HOMEPATH;
        if (!/msys\/bin|Git\/bin/.test(process.env.PATH))
            process.env.PATH = path.join(process.env.HOME, ".c9", "msys/bin") + ";" + process.env.PATH;
    }

    var home = process.env.HOME;

    if (!installPath)
        installPath = path.join(home, ".c9");

    var correctedInstallPath = installPath.substr(0, home.length) == home
        ? "~" + installPath.substr(home.length)
        : installPath;
    var inContainer = os.hostname().match(/-\d+$/);

    var config = {
        local: false,
        appHostname:'localhost/workspace',
        //hostname:'localhost/workspace',
        domains: 'local.c9ide.com',
        standalone: true,
        startBridge: true,
        manifest: manifest,
        workspaceDir: workspaceDir,
        projectName: path.basename(workspaceDir),
        homeDir: home,
        workspaceId: "devel",
        workspaceName: "devel",
        tmpdir: "/tmp",
        home: home,
        uid: "-1",
        dev: true,
        sdk: sdk,
        pid: process.pid,
        port: process.env.PORT || 8181,
        host: process.env.IP || (inContainer ? "0.0.0.0" : "127.0.0.1"),
        testing: false,
        platform: process.platform,
        arch: process.arch,
        tmux: path.join(installPath, "bin/tmux"),
        nakBin: path.join(__dirname, "../node_modules/nak/bin/nak"),
        bashBin: "bash",
        nodeBin: [path.join(installPath, win32 ? "node.exe" : "node/bin/node"), process.execPath],
        installPath: installPath,
        correctedInstallPath: correctedInstallPath,
        staticPrefix: "/static",
        projectUrl: "/workspace",
        ideBaseUrl: "http://local.c9ide.com",
        previewUrl: "/workspace",
        dashboardUrl: "http://local.c9ide.com/dashboard.html",
        apiUrl: "https://api.c9.dev",
        homeUrl: "/workspace",
        collab: false,
        installed: true,
        packed: false,
        packedThemes: true,
        readonly: false,
        role: "a",
        isAdmin: false,
        runners: runners,
        builders: builders,
        //"plugins/c9.ide.run/gui": {
        //    packagePath: "plugins/c9.ide.run/gui",
        //    defaultConfigs: {enable:false}
        //},
        themePrefix: "/static/standalone/skin",
        c9 : {
            startdate: new Date(),
            debug: true,
            hosted: false,
            local: true,
            home: process.env.HOME,
            setStatus: function(){},
            location: "",
            platform: process.platform,
            hostname:'localhost'
        },
        cdn: {
            version: "standalone",
            cacheDir: __dirname + "/../build",
            compress: false,
            baseUrl: ""
        },
        mount: {
            fusermountBin: "fusermount",
            curlftpfsBin: "curlftpfs",
            sshfsBin: "sshfs"
        },
        saucelabs: {
            serverURL: null, // testing: "https://jlipps.dev.saucelabs.net"
            account: {
                username: "saucefree000093",
                apikey: "3227f6a3-3861-4a56-8b27-e756ce0bba20"
            },
            assumeConnected: true
        },
        feedback: {
            userSnapApiKey: "a83fc136-1bc4-4ab8-8158-e750c30873b5"
        },
        support: {
            userSnapApiKey: "e3d3b232-1c21-4961-b73d-fbc8dc7be1c3"
        },
        user: {
            id: -1,
            name: "johndoe",
            fullname: "John Doe",
            email: "johndoe@example.org",
            pubkey: null
        },
        project: {
            id: 1,
            name: "myproject",
            contents: null,
            descr: "descr"
        },
        analytics: {
            segmentio: {
                secret: "12346",
                flushAt: 1, // The number of messages to enqueue before flushing.
                integrations: {
                    "All": true
                }
            },
            treasureData: {
                tdWriteKey: "12346",
                tdDb: "test_db",
                tdAgentHost: "localhost",
                tdAgentPort: 24224
            }
        },
        raygun: {
            server: {
                apiKey: "1234"
            },
            client: {
                apiKey: "1234"
            }
        },
        pricing: {containers: []},
        zuora: {},
        localExtend: true,
        extendDirectory: __dirname + "/../plugins"
    };

    config.extendOptions = {
        user: config.user,
        project: config.project,
        readonly: config.readonly
    };

    return config;
};
