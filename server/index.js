var fs = require('fs');
var http = require('http');
var https = require('https');
var cors = require('cors');
var mp = require('multiparty');
var AWS = require('aws-sdk');

var privateKey = fs.readFileSync(__dirname + '/server.key');
var certificate = fs.readFileSync(__dirname + '/server.crt');
var credentials = { key: privateKey, cert: certificate };
var express = require('express');
var app = express();
app.use(cors());

AWS.config.loadFromPath('./config.json');

var httpsServer = https.createServer(credentials, app);

app.get('/data', function(req, res) {
    var dynamo = new AWS.DynamoDB();
    var params = {
        TableName: 'my-test-table'
    };
    dynamo.scan(params, function(err, data) {
        if (err) console.log(err);
        // else console.log(data);
        else {
            console.log(data);
            console.log(JSON.stringify(data));
            res.send(JSON.stringify(data));
        }
    });
});

app.post('/', function(req, res) {
    var form = new mp.Form();
    form.parse(req, function(err, fields, files) {
        fs.readFile(files.file[0].path, function(err, fileData) {

            var fileName = fields.name[0];
            var s3 = new AWS.S3();
            s3.listBuckets(function(err, data) {
                if (err) {
                    console.log(err, err.stack);
                } else {
                    var myBucketName = data.Buckets[0].Name;
                    var params = {
                        Bucket: myBucketName,
                        Body: fileData,
                        Key: fields.name[0]
                    }
                    s3.putObject(params, function(err, data) {
                        if (err) console.log(err, err.stack);
                        else console.log(data);
                    });

                    var dynamodb = new AWS.DynamoDB();
                    params = {};
                    var tableName = "";
                    dynamodb.listTables(params, function(err, data) {
                        if (err) console.log(err, err.stack);
                        else {
                            tableName = data.TableNames[0];
                            console.log(tableName);
                            params = {
                                Item: {
                                    "fileName": {
                                        S: fields.name[0]
                                    },
                                    "path": {
                                        S: fields.name[0]
                                    },
                                    "type": {
                                        S: fields.type[0]
                                    }
                                },
                                TableName: tableName
                            }
                            dynamodb.putItem(params, function(err, data) {
                                if (err) console.log(err);
                                else console.log(data);
                            });
                        }
                    });
                }
            });

            return res.send(JSON.stringify({
                "name": fields.name[0],
                "type": fields.type[0],
                "file": fileData
            }));
        });
    });
});

httpsServer.listen(3000, function() {
    console.log("listening on port 3000");
});