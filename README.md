[![Codacy Badge](https://api.codacy.com/project/badge/Grade/864c2490ba404e91b3975910b3c6d8c7)](https://www.codacy.com/app/antoine-stalin/tasty-core?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=tasty-it/tasty-core&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/e344b9e77d4f4dbca92ca6300df3dce7)](https://www.codacy.com/app/antoine-stalin/tasty-core?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=stalina/tasty-core&amp;utm_campaign=Badge_Coverage)
[![Build Status](https://travis-ci.org/tasty-it/tasty-core.svg?branch=master)](https://travis-ci.org/tasty-it/tasty-core)

# tasty-core
Core of the tasty test framework : test made Natural

## Prerequiste

NodeJs is installed  (V5 +)

## Getting Started
TODO

## Install

`cd tasty-core`

`npm install`

PhantomJs binary needs to be in your PATH, for this purpose, you can add symbolic link to the executable : <br/>
`ln -s <path to tasty-core>/node_modules/phantomjs-prebuilt/bin/phantomjs /usr/bin/pahntomjs`

OPTIONAL, you can do the same with the chrome driver (in case you want to run test in Chrome) : <br/>
`ln -s <path to tasty-core>/node_modules/chromedriver/bin/chromedriver /usr/bin/chromedriver`

## Run 
* Tests: `gulp test`
* Integration Tests : `gulp it`
* Everything : `gulp`

## Developpers information
See wiki : https://github.com/stalina/tasty-core/wiki

## File naming convention
These are the extension that we advice to use but for your own need, you can use any extension you need.

### tasty script file
Tasty script files can contain either tasty instruction defined in conf file or raw selenium-driver (javascript) code line.  
Extension that should be used : `.tty`

### tasty instruction file
Tasty instruction files contains custom intruction written either with already defined tasty instruction or raw selenium-driver (javascript) code line.  
Extension that should be used : `.conf.tty`

### tasty parameter file
Tasty parameters file contains couples of key/value (as a property file).  
Extension that should be used : `.param.tty`
