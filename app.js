const express = require('express');
const app = express()
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const path = require('path')


app.get('/', (req, res) => {

    res.send("hello world")
});

app.get('/auth', (req, res) => {

    // If modifying these scopes, delete token.json.
    const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
    // The file token.json stores the user's access and refresh tokens, and is
    // created automatically when the authorization flow completes for the first
    // time.
    const TOKEN_PATH = 'token.json';

    // Load client secrets from a local file.
    fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Drive API.
        authorize(JSON.parse(content), uploadFile);
    });

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback) {
        const { client_secret, client_id, redirect_uris } = credentials.web;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getAccessToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);
        });
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    function getAccessToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return console.error('Error retrieving access token', err);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) return console.error(err);
                    console.log('Token stored to', TOKEN_PATH);
                });
                callback(oAuth2Client);
            });
        });
    }

    /**
     * Lists the names and IDs of up to 10 files.
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */

    function uploadFile(auth) {
        const drive = google.drive({ version: 'v3', auth });
        const directory = 'D:/data/';
        const fs = require('fs');

        fs.readdir(directory, (err, files) => {

    
      //   console.log("files length=========================", files.length)
      //   console.log("files============================",files)

             files.forEach(file => {
              //  console.log(" Each files===================================",file)

                const fileMetadata = {
                    'name': file,
                    parents: ['1DnJbRs1Rpgbtp1AR1fH78PcHg8pB5uUd']
                };

                const media = {
                    mimeType: 'images/jpeg',
                   body: fs.createReadStream(`D:/data/${file}`)
                   
                };
                drive.files.create({
                    resource: fileMetadata,
                    media: media,
                    fields: 'id'
                }, (err, file) => {
                    if (err) {
                        // Handle error
                        console.error(err);
                    } else {
                        console.log('File Id: ', file);
                    }
                });
            });
        });

    }

});

app.listen(3000, () => {
    console.log('Server is up and running at ')
})
