[![Codacy Badge](https://api.codacy.com/project/badge/Grade/4bb2ab1ad50e438685ed89f47aac65e8)](https://www.codacy.com/app/tastee/tastee-core?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=tastee/tastee-core&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/4bb2ab1ad50e438685ed89f47aac65e8)](https://www.codacy.com/app/tastee/tastee-core?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=tastee/tastee-core&amp;utm_campaign=Badge_Coverage)
[![Build Status](https://travis-ci.org/tastee/tastee-core.svg?branch=master)](https://travis-ci.org/tastee/tastee-core)

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
Extension that should be used : `.yaml`

### tastee parameter file
Tastee parameters file contains couples of key/value (as a property file).  
Extension that should be used : `.param.tee`
