/**
 * Send email request data
 * 发送邮件请求数据
 */
export type SendEmailRQ = {
    /**
     * Recipient
     * 收件人
     */
    recipient: string;

    /**
     * Subject
     * 主题
     */
    subject: string;

    /**
     * Template name
     * 模板名称
     */
    template: string;

    /**
     * token
     * 令牌
     */
    token: string;

    /**
     * Additional data
     * 更多数据
     */
    data: string | object;
};
