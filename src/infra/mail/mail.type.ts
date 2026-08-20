export type SendEmailOptions = {
    to: string | string[];
    subject: string;
    html: string;
};

export type SendTemplateOptions = {
    to: string | string[];
    subject: string;
    template?: string; // e.g. "auth/otp-email"
    html?: string; // pre-rendered HTML
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context?: Record<string, any>;
    from?: string;
};
