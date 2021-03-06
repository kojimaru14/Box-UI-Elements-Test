// import express from 'express' <- this syntax is not supported in ES2015 - node.js
const express = require("express");
const path = require('path');

const config = require(process.env.CONFIG_JSON_PATH || './BoxJWTConfig.json');
var BoxSDK = require('box-node-sdk');

const app = express();

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

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;    // For debugging purpose
const PORT = process.env.PORT || 3000;
app.listen(PORT);       // HTTP  server at port 5000 (http://localhost:3000/)

// Nginxを使用しない場合は、expressでhttpsサーバーを作成する
if ( !process.env.NGINX ) {
    // httpsが必須要件らしいので、HTTPSサーバーとして作成（実際、検証するとhttpではダメだった）
    // https://ja.developer.box.com/guides/embed/ui-elements/open-with/#box-edit
    
    // import https for creating https server
    const https = require('https');
    const fs = require('fs');

    var options = {
        key: fs.readFileSync('./nginx/server_key.pem'),
        cert: fs.readFileSync('./nginx/server_crt.pem')
    };
    const server = https.createServer( options, app );
    server.listen(4000);    // HTTPS server at port 4000 (https://localhost:4000/)
    console.log("Https running on 4000")
}

/*
https://ja.developer.box.com/guides/embed/ui-elements/custom-domains/#セーフリストへの追加windowsの場合
Windowsの場合は、レジストリに使用しているページのドメインをホワイトリストとして事前に登録する必要があります。
localhostを使用している場合は、ドメイン名は "localhost:4000" でOK（4000はポート番号）
*/
