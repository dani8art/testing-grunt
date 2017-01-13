/*!
registry 1.0.0, built on: 2017-01-13
Copyright (C) 2017 ISA group (isagroup.us@gmail.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
"use strict";var jsyaml=require("js-yaml"),fs=require("fs"),winston=require("winston"),configString=fs.readFileSync("./config/config.yaml","utf8"),config=jsyaml.safeLoad(configString)[process.env.NODE_ENV?process.env.NODE_ENV:"development"];config.parallelProcess.guarantees=process.env.GUARANTEES_PARALLEL_PROCESS?process.env.GUARANTEES_PARALLEL_PROCESS:config.parallelProcess.guarantees,config.parallelProcess.metrics=process.env.METRICS_PARALLEL_PROCESS?process.env.METRICS_PARALLEL_PROCESS:config.parallelProcess.metrics,config.state={logger:null,agreementsInProgress:[]},module.exports=config,module.exports.setProperty=function(a,b){this[a]=b};var logConfig={levels:{error:7,warning:8,ctlAgreement:9,ctlState:9,agreement:10,pricing:10,quotas:10,rates:10,guarantees:10,metrics:10,sm:11,streaming:13,info:12,debug:13},colors:{error:"red",warning:"yellow",agreement:"magenta",ctlAgreement:"blue",ctlState:"blue",pricing:"green",quotas:"green",rates:"green",guarantees:"green",metrics:"cyan",sm:"grey",streaming:"green",info:"white",debug:"black"}};winston.emitErrs=!0,module.exports.logger=new winston.Logger({levels:logConfig.levels,colors:logConfig.colors,transports:[new winston.transports.File({level:module.exports.loggerLevel,filename:"logs.log",handleExceptions:!0,json:!1,maxsize:5242880,maxFiles:5,colorize:!1}),new winston.transports.Console({level:module.exports.loggerLevel,handleExceptions:!0,json:!1,colorize:!0,timestamp:!0})],exitOnError:!1}),module.exports.stream={write:function(a,b){module.exports.logger.info(a)}};