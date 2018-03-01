const express = require('express');
const wwwhisper = require('connect-wwwhisper');
const app = express();
// app holds a reference to express or connect framework, it
// may be named differently in your source file.
app.use(wwwhisper());

// Alternatively, if you don't want wwwhisper to insert
// a logout iframe into HTML responses use.
app.use(wwwhisper(false));