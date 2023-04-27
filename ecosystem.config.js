module.exports = {
    apps: [{
        name: 'serve_litty.us',
        script: 'bin/serve',
        exec_interpreter: 'none',
        exec_mode: 'fork',         
        env: {
            NODE_ENV: 'production',
        }
    }]
};
