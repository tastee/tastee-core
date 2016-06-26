
# tastee-core
(Toast your Application with Simple Tests End to End)
Core of the tastee test framework : test made Natural

## Prerequiste

NodeJs is installed  (V5 +)

## Getting Started
TODO

## Install

`cd tastee-core`

`npm install`

PhantomJs binary needs to be in your PATH, for this purpose, you can add symbolic link to the executable : <br/>
`ln -s <path to tastee-core>/node_modules/phantomjs-prebuilt/bin/phantomjs /usr/bin/pahntomjs`

OPTIONAL, you can do the same with the chrome driver (in case you want to run test in Chrome) : <br/>
`ln -s <path to tastee-core>/node_modules/chromedriver/bin/chromedriver /usr/bin/chromedriver`

## Run 
* Tests: `gulp test`
* Integration Tests : `gulp it`
* Everything : `gulp`

## Developpers information
See wiki : https://github.com/tastee/tastee-core/wiki

## File naming convention
These are the extension that we advice to use but for your own need, you can use any extension you need.

### tastee script file
Tastee script files can contain either tastee instruction defined in conf file or raw selenium-driver (javascript) code line.  
Extension that should be used : `.tee`

### tastee instruction file
Tastee instruction files contains custom intruction written either with already defined tastee instruction or raw selenium-driver (javascript) code line.  
Extension that should be used : `.conf.tee`

### tastee parameter file
Tastee parameters file contains couples of key/value (as a property file).  
Extension that should be used : `.param.tee`
