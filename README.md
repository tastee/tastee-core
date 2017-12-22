[![Codacy Badge](https://api.codacy.com/project/badge/Grade/4bb2ab1ad50e438685ed89f47aac65e8)](https://www.codacy.com/app/tastee/tastee-core?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=tastee/tastee-core&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/4bb2ab1ad50e438685ed89f47aac65e8)](https://www.codacy.com/app/tastee/tastee-core?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=tastee/tastee-core&amp;utm_campaign=Badge_Coverage)
[![Build Status](https://travis-ci.org/tastee/tastee-core.svg?branch=master)](https://travis-ci.org/tastee/tastee-core)

# tastee-core
(Toast your Application with Simple Tests End to End)
Core of the tastee test framework : test made Natural

## Prerequiste

NodeJs is installed  (V5 +)

## Getting Started

### with UI
Please have a look at https://github.com/tastee/tastee-ui to get started with Tastee-UI as an end user

### with NPM
Please have a look at https://github.com/tastee/tastee-npm to get started with Tastee as command line tool

### In your own application
Tastee core can be intregrated in your own application where you can easisly control it with `TasteeCore` Object.

To Instanciate engine :
```
this.core = new TasteeCore(new TasteeAnalyser());
```

To launch tastee with your favorite browser (Chrome and Firefox supported by now) :
```
this.core.init(new TasteeEngine('chrome'|'firefox'));
```

To add Plugin file (`YAML`) in context :
```
this.core.addPluginFile(filePath);
```

To add parameter file (`Properties`) in context:
```
this.core.addParamFile(filePath);
```

To run tastee lines:
```
this.core.execute(myArrayOfTasteeLineAsString, filePath);
```

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
Extension that should be used : `.html`

### tastee instruction file
Tastee instruction files contains custom intruction written either with already defined tastee instruction or raw selenium-driver (javascript) code line.  
Extension that should be used : `.yaml`

### tastee parameter file
Tastee parameters file contains couples of key/value (as a property file).  
Extension that should be used : `.properties`
