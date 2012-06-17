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
    if (id in validUserIDs) {
        process.stdout.write("REPEAT USER");
    }
    else {
        validUserIDs.push(id);
        if (tests == expectedTests) {
            process.stdout.write("There were " + tests.toString() + " valid access tokens.")
        }
        else {
            tests++;
        }
    }
}

/*
 * Function: recievePermissions
 * Takes the result of a graph.facebook.com/me/permissions call and deals with
 * it.
 */
recievePermissions = function(result) {
    var jsonAnswer = JSON.stringify(answer);
    if (jsonAnswer.error) {
        process.stdout.write("Error: " + JSON.stringify(jsonAnswer));
    }
    else {
        restler.get("https://graph.facebook.com/me?access_token=" + JSON.stringify(token), recieveInfo);
    }
}

fs.readFile(program.args[0], function(err, data) {
    if(err) {
        process.stdout.write("There was an error when reading the file. Did you misspell the name?");
    }
    else {
        var tokens = data.split('\n');
        expectedTests = tokens.length;
        for(var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            restler.get("https://graph.facebook.com/me/permissions?access_token=" + token.toString(), recievePermissions);
        }
    }
});
