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


## Using Node.js
Run the following command:

    npm install     <- first time ONLY
    npm run start

To access the page, 
- http://localhost:3000
- https://localhost:4000


## Using Docker
Run the following command (containers are built and launched based on [docker-compose.yaml](docker-compose.yaml)):

    docker-compose up

To access the page,
- http://192.168.99.100
- https://192.168.99.100

where 192.168.99.100 is the IP address of docker VM (can be looked up by running `docker-machine ip`)

## Using Kubernetes
To initiate services and deployments inside [k8s](k8s) folder, run the below command:

    kubectl apply -f k8s

To access the page,
- http://192.168.99.101
- https://192.168.99.101

where 192.168.99.101 is the IP address of minikube (can be looked up by running `minikube ip`)

To get the list of pods, run this:

    kubectl get pods

Output:

    NAME                                  READY   STATUS    RESTARTS   AGE
    express-deployment-5989b69bf7-gj47s   1/1     Running   0          60s
    express-deployment-5989b69bf7-t455w   1/1     Running   0          69s
    express-deployment-5989b69bf7-vhcrd   1/1     Running   0          65s

To get the log of a specific pod, run this:

    kubectl logs express-deployment-5989b69bf7-gj47s

Output:

    > ui_elements@1.0.0 start /app
    > nodemon index.js

     [33m[nodemon] 2.0.4 [39m
     [33m[nodemon] to restart at any time, enter `rs` [39m
     [33m[nodemon] watching path(s): *.* [39m
     [33m[nodemon] watching extensions: js,mjs,json [39m
     [32m[nodemon] starting `node index.js` [39m


To clean up k8s services/deployments, run this:

    kubectl delete -f k8s

To update docker image, run this:

    docker build -t lyugaloki/ui-elements-express -f ./Dockerfile.dev .
    docker push lyugaloki/ui-elements-express