// import express from 'express' <- this syntax is not supported in ES2015 - node.js
const express = require("express");
const path = require('path');

// import https for creating https server
const https = require('https');
const fs = require('fs');

const config = require('C:\\Box_SDK\\BoxCLI\\39235654_zupg6r6a_config_codepen.json');  
var BoxSDK = require('box-node-sdk');

const app = express();

// httpsが必須要件らしいので、HTTPSサーバーとして作成（実際、検証するとhttpではダメだった）
// https://ja.developer.box.com/guides/embed/ui-elements/open-with/#box-edit
var options = {
    key: fs.readFileSync('./server_key.pem'),
    cert: fs.readFileSync('./server_crt.pem')
};
const server = https.createServer( options, app );

const app_user_id = '8352023916'
const file_id = '686737978452'

// https://github.com/box/box-node-sdk#app-auth-client
var sdk = BoxSDK.getPreconfiguredInstance(config);
var client = sdk.getAppAuthClient('user', app_user_id);
//var client = sdk.getAppAuthClient('enterprise');

// https://github.com/box/box-node-sdk/blob/master/docs/users.md#get-the-current-users-information
async function getCurrentUser() {
    let user = await client.users.get(client.CURRENT_USER_ID)
    console.log("Current user: ", user.login)    
    return user
}
getCurrentUser()

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    // https://github.com/box/box-node-sdk/blob/master/docs/authentication.md#token-exchange
    client.exchangeToken(
        ["item_execute_integration", "item_readwrite", "item_preview", "root_readwrite"], // 各アプリでFileを開くのに必要なスコープ：https://ja.developer.box.com/guides/embed/ui-elements/open-with/#スコープ
        'https://api.box.com/2.0/files/'+file_id
	).then(tokenInfo => {
        res.render('index', {ACCESS_TOKEN: tokenInfo.accessToken, FILE_ID: file_id } );  //この例の場合index.ejsファイルとして解釈される
    });
});

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const PORT = process.env.PORT || 5000;
app.listen(PORT);       // HTTP  server at port 5000 (http://localhost:5000/)
server.listen(4000);    // HTTPS server at port 4000 (https://localhost:4000/)
/*
https://ja.developer.box.com/guides/embed/ui-elements/custom-domains/#セーフリストへの追加windowsの場合
Windowsの場合は、レジストリに使用しているページのドメインをホワイトリストとして事前に登録する必要があります。
localhostを使用している場合は、ドメイン名は "localhost:4000" でOK（4000はポート番号）
*/
