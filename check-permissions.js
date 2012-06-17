#!/usr/bin/env node

var program = require('commander')
    , fs = require("fs")
    , restler = require("restler");

program
    .version('1.0.0')
    .description("Checks a line deliniated list of facebook access tokens and prints the number of unique facebook users that have given the program access to their facebook page.")
    .parse(process.argv);

var validUserIDs = [];
var expectedTests = 0;
var tests = 0;

/*
 * Function: recieveInfo
 * Handles facebook user info.
 */
recieveInfo = function(data) {
    var jsonData = JSON.stringify(data);
    var id = jsonData.id;
    console.log("RECIEVE");
    if (id in validUserIDs) {
        console.log("REPEAT USER");
    }
    else {
        validUserIDs.push(id);
        if (tests == expectedTests) {
            console.log("There were " + tests.toString() + " valid access tokens.")
        }
        else {
            tests++;
        }
    }
}

fs.readFile(program.args[0], function(err, data) {
    if(err) {
        console.log("There was an error when reading the file. Did you misspell the name?");
    }
    else {
        var tokens = data.toString().split('\n');
        expectedTests = tokens.length;
        for(var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            restler.get("https://graph.facebook.com/me/permissions?access_token=" + token.toString()).on('complete', function(answer) {

                var jsonAnswer = JSON.parse(answer);
                console.log(answer);
                if ("error" in jsonAnswer) {
                    console.log("Error: " + answer);
                }
                else {
                    console.log("recieved permissions info for test");
                    restler.get("https://graph.facebook.com/me?access_token=" + JSON.stringify(token)).on('complete', recieveInfo);
                }
            });
        }
    }
});
