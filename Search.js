const boxSDK = require("box-node-sdk");
const config = require("C:\\Development\\BoxCLI\\39235654_01zaiaa8_config_JikoEntCLI.json");

const main = async () => {
  try {
    // https://github.com/box/box-node-sdk#app-auth-client
    var sdk = boxSDK.getPreconfiguredInstance(config);
    // var auClient = sdk.getAppAuthClient('user', app_user_id);
    var client = sdk.getAppAuthClient('enterprise');

    // https://github.com/box/box-node-sdk/blob/master/docs/users.md#get-the-current-users-information
    let appUser = await client.users.get(client.CURRENT_USER_ID);
    console.log('Current user: ', appUser.login, appUser.id);
    searchFolder(client, "test", "file", "file_content,name", 1000, "0" );
  } catch (e) {
    console.error('Error: ', e.toString());
  }
};

function searchFolder(
  client,
  targetname,
  type,
  content_types,
  limit,
  ids,
  method,
  data,
  success,
  error
) {
  return new Promise(function (resolve, reject) {
    client.search
      .query('"' + targetname + '"', {
        fields: 'id,name,modified_at,size,extension,permissions,sync_state, collections',
        type: type,
        content_types: content_types,
        limit: limit,
        ancestor_folder_ids: ids,
        offset: 0,
      })
      .then(function (results) {
        // 結果は配列にまとまって帰ってくる ['a', 'b', 'c']
        console.log('searchFolder:' + targetname + `_results: ${JSON.stringify(results, null, 2)}`);
        console.log(
          'searchFolder:' + targetname + `_id: ${JSON.stringify(results.entries[0].id, null, 2)}`
        );
        resolve(results.entries[0].id);
      })
      .catch(function (error) {
        // 結果は配列にまとまって帰ってくる ['a', 'b', 'c']
        console.log('searchFolder:' + `results: ${JSON.stringify(error, null, 2)}`);
        reject(error);
      });
  });
}

main();
