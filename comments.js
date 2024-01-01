// Create web server
// 1. Create a web server
// 2. Load index.html
// 3. Load comments from db
// 4. Return comments to index.html

var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var db = require('./db');
var url = require('url');

var server = http.createServer(function (req, res) {
    // Get path from url
    var urlObj = url.parse(req.url);
    var pathname = urlObj.pathname;
    if (pathname == '/') {
        // Load index.html
        var filePath = path.join(__dirname, 'index.html');
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err) {
                console.error(err);
                res.statusCode = 404;
                res.end('File not found.');
            } else {
                // Load comments from db
                db.loadComments(function (comments) {
                    // Return comments to index.html
                    if (comments) {
                        comments.forEach(function (comment) {
                            var date = new Date(comment.timestamp);
                            comment.date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                        });
                    }
                    data = data.replace('##comments##', JSON.stringify(comments));
                    res.setHeader('Content-Type', 'text/html;charset=utf-8');
                    res.end(data);
                });
            }
        });
    } else if (pathname == '/add') {
        // Add comment
        var comment = urlObj.query;
        comment = JSON.parse(decodeURIComponent(comment));
        comment.timestamp = Date.now();
        // Save comment to db
        db.addComment(comment, function (comments) {
            // Return comments to index.html
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.end(JSON.stringify(comments));
        });
    } else if (pathname == '/delete') {
        // Delete comment
        var id = urlObj.query;
        id = JSON.parse(decodeURIComponent(id)).id;
        // Delete comment from db
        db.deleteComment(id, function (comments) {
            // Return comments to index.html
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.end(JSON.stringify(comments));
        });
    } else {
        // Load static resources
        var filePath = path.join(__dirname, pathname);
        fs.exists(filePath, function (exists) {
            if (exists) {
                res.setHeader('Content-Type', mime.lookup(filePath) + ';charset=utf-8');
                fs.createReadStream(filePath).pipe(res);
            } else {
                res.statusCode = 404;
                res.end('File not found.');
            }
        });
    }