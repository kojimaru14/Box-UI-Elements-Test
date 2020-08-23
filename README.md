# Box UI Elements test codes
Codes for testing UI Elements on localhost (or Docker)
- Repo: https://github.com/box/box-ui-elements
- Doc: https://developer.box.com/guides/embed/ui-elements/



## Getting started
- Download your [config.json](BoxJWTConfig.json.sample) from Develpoer Console (more info: https://developer.box.com/guides/authentication/jwt/without-sdk/#1-read-json-configuration)
- Add your (localhost) domains to your Box application to enable CORS (more info: https://developer.box.com/guides/best-practices/cors/)
- If you want to use `ContentOpenWith`, 
  - run [PleaseReadMe.js](PleaseReadMe.js) in advance in order to add integration to your AppUser (more info: https://developer.box.com/guides/embed/ui-elements/open-with/#add-integration-to-user)
  - safelist your (localhost) domains on your PC/Mac (more info: https://developer.box.com/guides/embed/ui-elements/custom-domains/)



## Using Docker
Run the following command:

    docker-compose up