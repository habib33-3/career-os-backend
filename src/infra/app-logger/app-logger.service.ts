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

import { logConfig } from "./app-logger.config";

const { combine, errors, printf, timestamp } = format;

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
        // Format timestamp with date-fns
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
/*                              FILE LOG FORMAT                                */
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
/*                              LOGGER SERVICE                                 */
/* -------------------------------------------------------------------------- */

/**
 * True drop-in replacement for NestJS Logger
 * - Chalk-powered console logs (dev-friendly)
 * - JSON rotated files (prod-friendly)
 * - Correlation-id aware
 */
export class AppLoggerService implements LoggerService {
    private readonly logger: WinstonLogger;
    private readonly context: string;

    constructor(context?: string) {
        this.context = context ?? "AppLogger";

        this.logger = createLogger({
            exitOnError: false,
            format: combine(timestamp(), errors({ stack: true })),
            level: logConfig.level,
            transports: [
                new transports.Console({
                    format: combine(consoleFormat),
                }),
                new DailyRotateFile({
                    datePattern: logConfig.datePattern,
                    filename: "logs/application-%DATE%.log",
                    format: combine(
                        timestamp(),
                        errors({ stack: true }),
                        fileFormat
                    ),
                    maxFiles: logConfig.maxFiles,
                    zippedArchive: logConfig.zippedArchive,
                }),
            ],
        });
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

    setLogLevels(levels: LogLevel[]) {
        this.logger.level = levels[0];
    }
}
