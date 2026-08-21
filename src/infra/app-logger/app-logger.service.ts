/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerService, LogLevel } from "@nestjs/common";

import chalk from "chalk";
import { format as formatDate } from "date-fns";
import {
    createLogger,
    format,
    transports,
    Logger as WinstonLogger,
} from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import Transport from "winston-transport";

import { logConfig } from "./app-logger.config";

const { combine, errors, printf, timestamp } = format;

/* -------------------------------------------------------------------------- */
/*                              ENVIRONMENT                                   */
/* -------------------------------------------------------------------------- */

// eslint-disable-next-line n/prefer-global/process
const NODE_ENV = process.env.NODE_ENV ?? "development";

const IS_PRODUCTION = NODE_ENV === "production";
const IS_TEST = NODE_ENV === "test";
const IS_DEVELOPMENT = !IS_PRODUCTION && !IS_TEST;

/* -------------------------------------------------------------------------- */
/*                                COLOR SYSTEM                                */
/* -------------------------------------------------------------------------- */

const LOG_COLORS = {
    context: chalk.greenBright,
    correlation: chalk.gray,
    levels: {
        debug: chalk.cyan,
        error: chalk.redBright.bold,
        info: chalk.blueBright,
        verbose: chalk.magentaBright,
        warn: chalk.yellowBright.bold,
    },
    message: chalk.white,
    time: chalk.gray,
};

const LEVEL_ICONS: Record<string, string> = {
    debug: "🐞",
    error: "✖",
    info: "ℹ",
    verbose: "🔍",
    warn: "⚠",
};

/* -------------------------------------------------------------------------- */
/*                             CONSOLE LOG FORMAT                              */
/* -------------------------------------------------------------------------- */

const consoleFormat = printf(
    ({ context, correlationId, level, message, stack, timestamp }) => {
        const time = LOG_COLORS.time(
            formatDate(new Date(timestamp as number), "yyyy-MM-dd HH:mm:ss.SSS")
        );

        const lvlColor =
            LOG_COLORS.levels[level as keyof typeof LOG_COLORS.levels] ??
            chalk.white;

        const levelLabel = lvlColor(level.toUpperCase());

        // eslint-disable-next-line security/detect-object-injection
        const icon = LEVEL_ICONS[level] ?? "";

        const ctxLabel = LOG_COLORS.context(`[${context ?? "AppLogger"}]`);

        const corrLabel = correlationId
            ? LOG_COLORS.correlation(`(cid:${correlationId})`)
            : "";

        const msg = LOG_COLORS.message(
            typeof message === "string"
                ? message
                : JSON.stringify(message, null, 2)
        );

        const errorStack = stack ? `\n${chalk.red(stack)}` : "";

        return `${time}  ${icon} ${ctxLabel} ${corrLabel} ${levelLabel}: ${msg}${errorStack}`;
    }
);

/* -------------------------------------------------------------------------- */
/*                              FILE LOG FORMAT                               */
/* -------------------------------------------------------------------------- */

const fileFormat = printf(
    ({ context, correlationId, level, message, stack, timestamp }) =>
        JSON.stringify({
            context: context ?? null,
            correlationId: correlationId ?? null,
            level,
            message,
            stack: stack ?? null,
            timestamp,
        })
);

/* -------------------------------------------------------------------------- */
/*                          LEVEL PRIORITY (for setLogLevels)                 */
/* -------------------------------------------------------------------------- */

// Ordered from highest to lowest severity, matching Nest's LogLevel union.
// "log" maps to Winston's "info" level.
const NEST_TO_WINSTON_LEVEL: Record<string, string> = {
    debug: "debug",
    error: "error",
    fatal: "error",
    log: "info",
    verbose: "verbose",
    warn: "warn",
};

const LEVEL_PRIORITY: LogLevel[] = [
    "fatal",
    "error",
    "warn",
    "log",
    "verbose",
    "debug",
];

/* -------------------------------------------------------------------------- */
/*                              LOGGER SERVICE                                */
/* -------------------------------------------------------------------------- */

/**
 * Environment-aware drop-in replacement for NestJS Logger.
 *
 * Development:
 * - Colored console logs
 * - No log files
 *
 * Production:
 * - Console logs
 * - JSON rotated log files
 *
 * Test:
 * - Console logs
 * - No log files
 */
export class AppLoggerService implements LoggerService {
    private readonly logger: WinstonLogger;
    private readonly context: string;

    constructor(context?: string) {
        this.context = context ?? "AppLogger";

        const loggerTransports: Transport[] = [
            new transports.Console({
                format: combine(consoleFormat),
            }),
        ];

        // File logging is only enabled in production.
        if (IS_PRODUCTION) {
            loggerTransports.push(
                new DailyRotateFile({
                    datePattern: logConfig.datePattern,
                    filename: "logs/application-%DATE%.log",
                    format: combine(fileFormat),
                    maxFiles: logConfig.maxFiles,
                    zippedArchive: logConfig.zippedArchive,
                })
            );
        }

        this.logger = createLogger({
            exitOnError: false,
            format: combine(timestamp(), errors({ stack: true })),
            level: IS_TEST ? "error" : logConfig.level,
            transports: loggerTransports,
        });

        if (IS_DEVELOPMENT) {
            this.logger.debug(`Logger initialized in ${NODE_ENV} environment`);
        }
    }

    private getContext(context?: string) {
        return context ?? this.context;
    }

    log(message: any, context?: string, correlationId?: string) {
        this.logger.info(message, {
            context: this.getContext(context),
            correlationId,
        });
    }

    error(
        message: any,
        trace?: string,
        context?: string,
        correlationId?: string
    ) {
        this.logger.error(message, {
            context: this.getContext(context),
            correlationId,
            stack: trace,
        });
    }

    warn(message: any, context?: string, correlationId?: string) {
        this.logger.warn(message, {
            context: this.getContext(context),
            correlationId,
        });
    }

    debug(message: any, context?: string, correlationId?: string) {
        this.logger.debug(message, {
            context: this.getContext(context),
            correlationId,
        });
    }

    verbose(message: any, context?: string, correlationId?: string) {
        this.logger.verbose(message, {
            context: this.getContext(context),
            correlationId,
        });
    }

    /**
     * Nest calls this with the full set of enabled levels, e.g.
     * ['error', 'warn', 'log']. Winston only accepts a single severity
     * threshold, so we pick the lowest-priority (most verbose) level
     * present and use that as the Winston level.
     */
    setLogLevels(levels: LogLevel[]) {
        const lowest = LEVEL_PRIORITY.find((level) => levels.includes(level));

        if (!lowest) {
            return;
        }

        // eslint-disable-next-line security/detect-object-injection
        this.logger.level = NEST_TO_WINSTON_LEVEL[lowest] ?? "info";
    }
}
