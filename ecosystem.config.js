module.exports = {
    apps: [{
        name: 'https_litty.us',
        script: 'bin/serve-https',
        exec_interpreter: 'none',
        exec_mode: 'fork',         
        env: {
            NODE_ENV: 'production',
        }
    }, {
        name: 'http_litty.us',
        script: 'bin/serve-http',
        exec_interpreter: 'none',
        exec_mode: 'fork',
        env: {
            NODE_ENV: 'production',
        }
    }]
};
