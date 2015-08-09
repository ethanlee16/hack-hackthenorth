#!/usr/bin/env node
// Hack Hack the North
// @ethanlee16

var request = require('request');
var prompt = require('prompt');
var data;

var schema = {
    properties: {
      username: {
        description: "Enter the email you used to apply to Hack the North",
        required: true
      },
      password: {
        description: "Enter the password you used to apply to Hack the North",
        hidden: true,
        required: true
      }
    }
};

prompt.get(schema, function(err, result) {
    request({
      uri: "https://hackerapi.com/v1/auth/user",
      method: "POST",
      json: {
        username: result.username,
        password: result.password
      }
    }, function(err, resp, body) {
        if (!err && resp.statusCode == 200) {
            data = body;
            console.log("Your token is " + data.token);
            console.log("Logging in as " + data.name + "...");
            nextFunc(data);
        }
    });

    function nextFunc(data) {
        request('https://hackerapi.com/v1/search/claims?pipeline=1&token=' + data.token, function(err, resp, body) {
            if (!err && resp.statusCode == 200) {
                var res = JSON.parse(body);
                console.log("You were " + res[0].stage + " for Hack the North 2015.");
            }
        });
    }
});


