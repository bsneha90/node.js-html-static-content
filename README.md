# node.js-html-static-content
Serve HTML pages, scripts and styles using Node.js

## To build the Image

`docker build -t reportsapp:1.0 .`

Note - Image has to be built after every code change to get latest changes to the image.

## Run the application

`docker run -p 5000:5000 -v /tmp/htmls:/home/node/app/public  --name reports_server reportsapp:1.0`

### Note

* Above command mounts `/tmp/htmls` of host machine to containers, the htmls/docs inside this folder would be served by the application.
  This can be changed to any directory you would want. Make sure that directory is present on host machine before running above command.
