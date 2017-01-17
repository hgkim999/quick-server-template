# quick-server-template
Simple App Backend with NodeJS and Parse Server

### Tested Environment
* NodeJS: 7.4
* MongoDB: > 3.2
  * 3.2 includes field validator
* AWS EC2 Micro with Ubuntu 16.04

## Quick Links
* [Quick Client Template](https://github.com/hgkim999/quick-client-template) repo

### High level design for Quick Client and Quick Server
![Architecture Diagram](https://hgkim999.github.io/page/image/Architecture.png)


## Requirements
### Core Requirements
1. Ubuntu or similar OS that can run NodeJS and MongoDB
1. NodeJS: [Install Node.js via Package Manager](https://nodejs.org/en/download/package-manager/)
1. MongoDB: [Install MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/#install-mongodb-community-edition)
1. Parse Server: [Getting Started](https://github.com/ParsePlatform/parse-server#getting-started)
2. Grunt JS Task Runner: [Getting Started](http://gruntjs.com/getting-started)

### Dev Requirements(Optional)
1. [Atom](https://atom.io/) with [Nuclide](https://nuclide.io/docs/quick-start/getting-started/) on your laptop for Remote Development
2. [Nuclide Server](https://nuclide.io/docs/features/remote/) on your server
3. [Flow](https://flowtype.org/) Type Checker on your server

## Getting Started
1. Make sure all core requirements are correctly installed.
1. Clone the repository on the server.
1. Install Node Modules of both app-server and parse-server
    1. $ cd parse-server
    2. $ npm install
    3. $ cd ../app-server
    4. $ npm install
1. Rename or Copy config templates into config.json
    1. $ cd parse-server / cd app-server
    1. $ cp config.template.json config.json
    1. Replace placeholders to your app information
        * *Parse App ID* and *MasterKey* are the custom values for your Parse Server
        * *Facebook App ID* and *App Secret* are given from your [Facebook Developers Account](https://developers.facebook.com/apps/)
        * **DO NOT SHARE YOUR APP SECRETS!**

## Run Servers
1. Open 2 console windows(or tabs)
2. For the Parse Server Window,
    1. $ cd parse-server
    1. $ grunt
2. For the App Server Window,
    1. $ cd app-server
    1. $ grunt
