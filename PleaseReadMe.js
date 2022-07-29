const boxSDK = require("box-node-sdk");
const config = require("C:\\Development\\Node\\UI_Elements\\BoxJWTConfig.json");
const fs = require("fs");

/*
 https://ja.developer.box.com/guides/embed/ui-elements/open-with/#ユーザーへの統合の追加
 上記ドキュメントによると、Open withを使う前にあらかじめ AppUser へ統合を登録しないといけないらしい
 なので、もし新しく AppUser を作成した場合は、この js を実行してその AppUser に統合を事前に登録しといてね
*/
const app_user_id = '8352023916'

const main = async () => {
  try {
    // https://github.com/box/box-node-sdk#app-auth-client
    var sdk = boxSDK.getPreconfiguredInstance(config);
    var auClient = sdk.getAppAuthClient('user', app_user_id);
    //var client = sdk.getAppAuthClient('enterprise');
    //const file_id = '493447143820'

    // https://github.com/box/box-node-sdk/blob/master/docs/users.md#get-the-current-users-information
    let appUser = await auClient.users.get(auClient.CURRENT_USER_ID)
    console.log("Current user: ", appUser.login, appUser.id)    

    // 念の為、現在利用可能なWebApp統合を一覧する
    // 13418が入っていないなら、設定がまちがっている
    const appIntegs = await auClient.get("/app_integrations");
    console.log("利用可能なWebApp統合一覧", appIntegs.body);
    /*
    {
      next_marker: null,
      entries: [
        { type: "app_integration", id: "10897" },
        { type: "app_integration", id: "1338" },
        { type: "app_integration", id: "13418" },  <= 13418がBox Editの統合
        { type: "app_integration", id: "3282" },
      ],
      limit: 100,
    };
    */

    appIntegs.body.entries.forEach( async(element, i) => {
        const res = await auClient.get(`/app_integrations/${element.id}`);
        console.log(`Integration${i}: `, res.body);
      }
    )

    // 作成したAppUserに、BoxEditのアプリ統合を利用できるようにする。
    // Authorizationにつけるアクセストークンは、ServiceAccountのものを利用する必要がある。
    const saTokenInfo = await sdk.getEnterpriseAppAuthTokens();
    console.log(saTokenInfo.accessToken);
    // https://github.com/box/box-node-sdk/blob/master/docs/client.md#post
    var params = {
      headers: {
        Authorization: `Bearer ${saTokenInfo.accessToken}`,
      },
      body: {
        assignee: { type: "user", id: `${appUser.id}` },
        app_integration: { type: "app_integration", id: "3282" }
        //app_integration: appIntegs.body.entries
      }
    };
    auClient.post("/app_integration_assignments", params, function(err, response) {
        if (err) {
          // handle error
          console.log("Error: ", err);
        }
        console.log("Response: ", response.body);
    });

    // 以下のAppUserとFileのIDをapp.jsで利用する
    console.log(
      "==================== 以下のIDをメモして、index.jsで利用する ===================="
    );
    console.log(`const USER_ID = "${appUser.id}"`);
    //console.log(`const FILE_ID = "${file_id}"`);
  } catch (e) {
    console.error("Error: ", e.toString());
  }
};

main();