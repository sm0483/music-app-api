const {createClient} =require('redis');

const client = createClient({
    password: '9yJh7qNym5u40AIrEA5wgWgdKHU5divy',
    socket: {
        host: 'redis-18273.c302.asia-northeast1-1.gce.cloud.redislabs.com',
        port: 18273
    }
});


module.exports = client;