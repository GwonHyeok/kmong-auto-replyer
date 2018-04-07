import winston = require("winston");

export default class Log {

    private static logger = process.env.NODE_ENV === 'production'
        ? Log.createProductionLogger() : Log.createDevelopmentLogger();

    private static createProductionLogger() {
        return this.createDevelopmentLogger()
    }

    private static createDevelopmentLogger() {
        return winston.createLogger({
            level: 'silly',
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.timestamp(),
                        winston.format.align(),
                        winston.format.printf((info) => {
                            const { timestamp, level, message, ...args } = info;
                            const ts = timestamp.slice(0, 19).replace('T', ' ');
                            return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
                        }),
                    )
                })
            ]
        })
    }

    public static d(message) {
        this.logger.log({ level: 'debug', message });
    }

    public static e(message) {
        this.logger.log({ level: 'error', message });
    }
}
