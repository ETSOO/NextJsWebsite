import {
    INotification,
    Notification,
    NotificationAlign,
    NotificationCallProps,
    NotificationContent,
    NotificationRenderProps,
    NotificationType
} from '@etsoo/notificationbase';
import { DomUtils } from '@etsoo/shared';
import { BSColor } from '../defs/BSColor';
import { SiteUtils } from '../site/SiteUtils';

/**
 * Notification Dom interface
 */
export interface INotificationDom
    extends INotification<HTMLDivElement, NotificationDomCallProps> {}

/**
 * Notification Dom call props
 */
export interface NotificationDomCallProps extends NotificationCallProps {
    /**
     * Full width
     */
    fullWidth?: boolean;

    /**
     * Full screen
     */
    fullScreen?: boolean;

    /**
     * Inputs layout
     */
    inputs?: HTMLDivElement;

    /**
     * Max width
     */
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;

    /**
     * OK label
     */
    okLabel?: string;

    /**
     * false to hide cancel button
     */
    cancelButton?: boolean;

    /**
     * Cancel label
     */
    cancelLabel?: string;

    /**
     * Type
     */
    type?: string;

    /**
     * Primary button props
     */
    primaryButton?: {};

    /**
     * Buttons to override default buttons
     */
    buttons?: (
        notification: INotificationDom,
        callback: (event: MouseEvent, value?: any) => Promise<boolean>
    ) => HTMLDivElement;
}

/**
 * Notification Dom
 */
export class NotificationDom
    extends Notification<HTMLDivElement, NotificationDomCallProps>
    implements INotificationDom
{
    private createButton(color: BSColor, value: string) {
        const button = document.createElement('button');
        button.className = `btn btn-${color}`;
        button.value = value;
        return button;
    }

    private toggleButtonSpinner(button: HTMLButtonElement) {
        let span = button.querySelector('.spinner-border');
        if (span == null) {
            span = document.createElement('span');
            span.className = 'spinner-border spinner-border-sm';
            span.role = 'status';
            button.prepend(span);

            button.disabled = true;
        } else {
            span.remove();
            button.disabled = false;
        }
    }

    // Create confirm
    private createConfirm(_props: NotificationRenderProps, className?: string) {
        // Destruct
        const type = this.type;
        const {
            buttons = (
                _notification: INotificationDom,
                callback: (event: MouseEvent, value?: any) => Promise<boolean>
            ) => {
                const div = document.createElement('div');

                if (cancelButton && type === NotificationType.Confirm) {
                    const cButton = this.createButton('secondary', cancelLabel);
                    cButton.name = 'cancelButton';
                    cButton.addEventListener('click', async (event) => {
                        this.toggleButtonSpinner(cButton);
                        await callback(event, false);
                        this.toggleButtonSpinner(cButton);
                    });
                    div.append(cButton);
                }

                const okButton = this.createButton('primary', okLabel);
                okButton.name = 'okButton';
                okButton.addEventListener('click', async (event) => {
                    this.toggleButtonSpinner(okButton);
                    await callback(event, true);
                    this.toggleButtonSpinner(okButton);
                });

                if (primaryButton) Object.assign(okButton, primaryButton);

                div.append(okButton);

                return div;
            },
            okLabel = SiteUtils.getLabel('ok', 'OK'),
            cancelLabel = SiteUtils.getLabel('cancel', 'Cancel'),
            cancelButton = true,
            inputs,
            primaryButton
        } = this.inputProps ?? {};

        const callback = async (_event: MouseEvent, value: boolean) => {
            await this.returnValue(value);
            return true;
        };

        // Modal
        const div = this.createModal(className);

        div.innerHTML = `<div class="modal-dialog${this.getDialogStyle()}">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body"></div>
            </div>
        </div>`;

        const titleE = div.querySelector<HTMLDivElement>('div.modal-title');
        this.createContent(titleE, this.title);

        const bodyE = div.querySelector<HTMLDivElement>('div.modal-body');
        this.createContent(bodyE, this.content);

        if (bodyE) {
            if (inputs) bodyE.append(inputs);

            const buttonsE = buttons(this, callback);
            buttonsE.classList.add('modal-footer');
            bodyE.parentElement?.append(buttonsE);
        }

        // Setup callback
        this.doSetup(div);

        return div;
    }

    private getDialogStyle() {
        // Destruct
        const align = this.align;
        const { maxWidth = false, fullScreen } = this.inputProps ?? {};

        const classNames: string[] = [];
        if (align === NotificationAlign.Center)
            classNames.push('modal-dialog-centered');
        if (maxWidth !== false) classNames.push(`modal-${maxWidth}`);
        if (fullScreen) classNames.push('modal-fullscreen');

        if (classNames.length === 0) return '';
        return ' ' + classNames.join(' ');
    }

    private createContent(
        container: HTMLElement | null,
        content?: NotificationContent<HTMLDivElement>
    ) {
        if (container == null || content == null) return;
        if (typeof content === 'string') {
            container.innerHTML = content;
        } else {
            container.append(content);
        }
    }

    private createModal(className?: string) {
        // Div
        const div = document.createElement('div');

        div.className = 'modal fad';
        if (className) div.classList.add(className);

        return div;
    }

    private doSetup(div: HTMLDivElement) {
        if (this.renderSetup) this.renderSetup(div);
    }

    // Create loading
    private createLoading(_props: NotificationRenderProps, className?: string) {
        // Modal
        const div = this.createModal(className);

        // Content
        let content = this.content;
        if (content === '@')
            content = SiteUtils.getLabel('loading', 'Loading...');

        div.innerHTML = `<div class="modal-dialog${this.getDialogStyle()}">
          <div class="modal-content d-flex justify-content-between flex-row align-items-center p-2">
            <div class="spinner-border spinner-border-sm" role="status"></div>
            <div class="spinner-title fs-6"></div>
          </div>
        </div>`;

        const titleE = div.querySelector<HTMLDivElement>('div.spinner-title');
        this.createContent(titleE, content);

        // Setup callback
        this.doSetup(div);

        return div;
    }

    private createPrompt(_props: NotificationRenderProps, className?: string) {
        // Destruct
        const {
            buttons = (
                _notification: INotificationDom,
                callback: (event: MouseEvent) => Promise<boolean>
            ) => {
                const div = document.createElement('div');

                if (cancelButton) {
                    const cButton = this.createButton('secondary', cancelLabel);
                    cButton.name = 'cancelButton';
                    cButton.addEventListener('click', async (event) => {
                        this.toggleButtonSpinner(cButton);
                        if (this.onReturn) await this.onReturn(undefined);
                        this.toggleButtonSpinner(cButton);
                        this.dismiss();
                    });
                    div.append(cButton);
                }

                const okButton = this.createButton('primary', okLabel);
                okButton.name = 'okButton';
                okButton.addEventListener('click', async (event) => {
                    this.toggleButtonSpinner(okButton);
                    await callback(event);
                    this.toggleButtonSpinner(okButton);
                });

                if (primaryButton) Object.assign(okButton, primaryButton);

                div.append(okButton);

                return div;
            },
            okLabel = SiteUtils.getLabel('ok', 'OK'),
            cancelLabel = SiteUtils.getLabel('cancel', 'Cancel'),
            cancelButton = true,
            inputs,
            primaryButton,
            type,
            inputProps
        } = this.inputProps ?? {};

        let input: HTMLInputElement | null = null;
        let errorDiv: HTMLDivElement | null = null;

        const setError = (error: string) => {
            if (errorDiv) errorDiv.innerHTML = error;
        };

        const handleSubmit = async (event: MouseEvent) => {
            // Form
            const button = event.currentTarget as HTMLButtonElement | null;
            if (button == null) return false;

            // Result
            let result:
                | boolean
                | string
                | void
                | PromiseLike<boolean | string | void> = undefined;

            if (this.onReturn) {
                // Inputs case, no HTMLForm set to value, set the current form
                if (inputs) {
                    result = this.onReturn(button.form);
                } else if (input) {
                    if (type === 'switch') {
                        result = this.onReturn(input.checked);
                    } else {
                        const inputValue = DomUtils.getInputValue(input);
                        if (
                            (inputValue == null || inputValue === '') &&
                            input.required
                        ) {
                            input.focus();
                            return false;
                        }
                        result = this.onReturn(inputValue);
                    }
                }
            }

            // Get the value
            // returns false to prevent default dismiss
            const v = await result;
            if (v === false) {
                input?.focus();
                return false;
            }
            if (typeof v === 'string') {
                setError(v);
                input?.focus();
                return false;
            }

            this.dismiss();
            return true;
        };

        // Modal
        const div = this.createModal(className);

        div.innerHTML = `<form
                onSubmit={(event) => {
                    event.preventDefault();
                    (
                        event.currentTarget.elements.namedItem(
                            'okButton'
                        ) as HTMLButtonElement
                    )?.click();
                    return false;
                }}
            ><div class="modal-dialog${this.getDialogStyle()}">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body"></div>
            </div>
        </div></form>`;

        const titleE = div.querySelector<HTMLDivElement>('div.modal-title');
        this.createContent(titleE, this.title);

        const bodyE = div.querySelector<HTMLDivElement>('div.modal-body');
        this.createContent(bodyE, this.content);

        if (bodyE) {
            if (inputs) bodyE.append(inputs);
            else {
                if (type === 'switch') {
                    const switchDiv = document.createElement('div');
                    switchDiv.className = 'form-check form-switch';
                    switchDiv.innerHTML = `<input class="form-check-input" type="checkbox" value="true" id="flexSwitchCheckDefault">`;
                    input = switchDiv.querySelector('input');
                    bodyE.append(switchDiv);
                } else if (type === 'slider') {
                    const sInput = document.createElement('input');
                    sInput.type = 'range';
                    sInput.className = 'form-range';
                    sInput.required = true;
                    input = sInput;
                    bodyE.append(sInput);
                } else {
                    const myInput = document.createElement('input');
                    myInput.type = type ?? 'text';
                    myInput.required = true;
                    myInput.className = 'form-control';
                    myInput.addEventListener('change', () => setError(''));
                    input = myInput;
                    bodyE.append(myInput);
                }

                if (input) Object.assign(input, inputProps);
            }

            // Error display
            errorDiv = document.createElement('div');
            errorDiv.className = 'text-danger';
            bodyE.append(errorDiv);

            const buttonsE = buttons(this, handleSubmit);
            buttonsE.classList.add('modal-footer');
            bodyE.parentElement?.append(buttonsE);
        }

        // Setup callback
        this.doSetup(div);

        return div;
    }

    private getColor(type: NotificationType) {
        return 'bg-' + NotificationType[type].toLocaleLowerCase();
    }

    private createMessage(_props: NotificationRenderProps, className?: string) {
        // Destruct
        const { type, content, title } = this;

        // Div
        const div = document.createElement('div');
        div.className = 'toast';

        div.innerHTML = `<div class="toast-header">
            <div class="rounded me-2 ${this.getColor(
                type
            )}" style="width: 20px; height: 20px"></div>
            <strong class="toast-title me-auto"></strong>
            <small class="toast-tip"></small>
        </div>
        <div class="toast-body"></div>`;

        const titleE = div.querySelector<HTMLDivElement>('strong.toast-title');
        this.createContent(titleE, title);

        const bodyE = div.querySelector<HTMLDivElement>('div.toast-body');
        this.createContent(bodyE, content);

        // Setup callback
        this.doSetup(div);

        return div;
    }

    render(
        props: NotificationRenderProps,
        className?: string | undefined
    ): HTMLDivElement | undefined {
        const type = this.type;
        if (type === NotificationType.Loading) {
            return this.createLoading(props, className);
        } else if (type === NotificationType.Confirm) {
            return this.createConfirm(props, className);
        } else if (type === NotificationType.Prompt) {
            return this.createPrompt(props, className);
        } else if (type === NotificationType.Error || this.modal) {
            return this.createConfirm(props, className);
        } else {
            return this.createMessage(props, className);
        }
    }
}
