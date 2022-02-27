const winston=require('winston')

const errorLevels={
    levels:{
        error:0,
},
    colors:{
        error:'red',
    }
}

winston.addColors(errorLevels.colors)

const errorLogger=winston.createLogger({
    level:'error',
    levels:errorLevels.levels,
    format:winston.format.combine(
        winston.format.timestamp({
            format:'DD-MM-YYYY HH:mm:ss'
        }),
        winston.format.align(),
        winston.format.printf((info)=>{
            return `[${info.timestamp}] [${info.level}]: ${info.message}`;
        })
    ),
    transports:[
        new winston.transports.File({
            filename:'logs/offchain/error.log',
            level:'error'
        }),
        new winston.transports.File({
            filename:'logs/offchain/complete.log',
        })
    ],
    exitOnError: false,
})
errorLogger.add(
    new winston.transports.File({
      filename: "logs/offchain/json.log",
      level: "error",
      format: winston.format.json(),
    })
  );

const actionLevels={
    levels:{
        action:0,
        error:1
},
    colors:{
        action:'blue'
    }
}
const actionLogger=winston.createLogger({
    level:'action',
    levels:actionLevels.levels,
    format:winston.format.combine(
        winston.format.timestamp({
            format:'DD-MM-YYYY HH:mm:ss'
        }),
        winston.format.align(),
        winston.format.printf((info)=>{
            return `[${info.timestamp}] [${info.level}]: ${info.message}`;
        })
    ),
    transports:[
        new winston.transports.File({
            filename:'logs/offchain/actions.log',
            level:'action'
        }),
        new winston.transports.File({
          filename:'logs/offchain/error.log',
          level:'error'
      }),
        new winston.transports.File({
            filename:'logs/offchain/complete.log',
        })
    ],
    exitOnError: false,
})
actionLogger.add(
    new winston.transports.File({
      filename: "logs/offchain/json.log",
      level: "action",
      format: winston.format.json(),
    })
  );



  // BLOCKCHAIN LOGGER
  // BLOCKCHAIN LOGGER
  // BLOCKCHAIN LOGGER
  // BLOCKCHAIN LOGGER
  // BLOCKCHAIN LOGGER


  const blockChainLevels = {
    levels: {
      error: 0,
      blockchain: 1,
      tokenLog: 2,
      transactionLog: 3,
    },
    colors: {
      error: "red",
      transactionLog: "blue",
      tokenLog: "green",
    },
  };
  
  winston.addColors(blockChainLevels.colors);
  
  const blockchainLogger = winston.createLogger({
    level: "tokenLog",
    levels: blockChainLevels.levels,
    format: winston.format.combine(
      winston.format.timestamp({
        format: "DD-MM-YYYY HH:mm:ss",
      }),
      winston.format.align(),
      winston.format.printf((info) => {
        return `[${info.timestamp}] [${info.level}]: ${info.message}`;
      })
    ),
    transports: [
      new winston.transports.File({
        filename: "logs/onchain/transactionLog.log",
        level: "transactionLog",
      }),
      new winston.transports.File({
        filename: "logs/onchain/error.log",
        level: "error",
      }),
      new winston.transports.File({
        filename: "logs/onchain/blockchain.log",
        level: "blockchain",
      }),
      new winston.transports.File({
        filename: "logs/onchain/tokenLog.log"
      }),
    ],
    exitOnError: false,
  });
  
  blockchainLogger.add(
    new winston.transports.File({
      filename: "logs/onchain/blockchain_json.log",
      level: "tokenLog",
      format: winston.format.json(),
    })
  );



  module.exports={
      errorLogger:errorLogger,
      actionLogger:actionLogger,
      blockchainLogger:blockchainLogger
  }