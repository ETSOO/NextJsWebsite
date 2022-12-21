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
     * Window is closable
     */
    closable?: boolean;

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
        button.className = `btn btn-${color} w-25`;
        button.innerHTML = value;
        return button;
    }

    // Create confirm
    private createConfirm(_props: NotificationRenderProps, className?: string) {
        // Destruct
        const {
            type,
            title = SiteUtils.getLabel(NotificationType[type].toLowerCase(), '')
        } = this;
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
                        SiteUtils.toggleButtonSpinner(cButton);
                        await callback(event, false);
                        SiteUtils.toggleButtonSpinner(cButton);
                    });
                    div.append(cButton);
                }

                const okButton = this.createButton('primary', okLabel);
                okButton.name = 'okButton';
                okButton.addEventListener('click', async (event) => {
                    SiteUtils.toggleButtonSpinner(okButton);
                    await callback(event, true);
                    SiteUtils.toggleButtonSpinner(okButton);
                });

                if (primaryButton) Object.assign(okButton, primaryButton);

                div.append(okButton);

                return div;
            },
            okLabel = SiteUtils.getLabel('ok', 'OK'),
            cancelLabel = SiteUtils.getLabel('cancel', 'Cancel'),
            cancelButton = true,
            closable = true,
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
                      ${
                          closable
                              ? `<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`
                              : ''
                      }
                  </div>
                  <div class="modal-body"></div>
              </div>
          </div>`;

        const titleE = div.querySelector<HTMLDivElement>('.modal-title');
        this.createContent(titleE, title);

        const bodyE = div.querySelector<HTMLDivElement>('.modal-body');
        this.createContent(bodyE, this.content);

        if (bodyE) {
            if (inputs) {
                inputs.classList.add('mt-3');
                bodyE.append(inputs);
            }

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

        const titleE = div.querySelector<HTMLDivElement>('.spinner-title');
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
                        SiteUtils.toggleButtonSpinner(cButton);
                        if (this.onReturn) await this.onReturn(undefined);
                        SiteUtils.toggleButtonSpinner(cButton);
                        this.dismiss();
                    });
                    div.append(cButton);
                }

                const okButton = this.createButton('primary', okLabel);
                okButton.name = 'okButton';
                okButton.addEventListener('click', async (event) => {
                    SiteUtils.toggleButtonSpinner(okButton);
                    await callback(event);
                    SiteUtils.toggleButtonSpinner(okButton);
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

        div.innerHTML = `<form><div class="modal-dialog${this.getDialogStyle()}">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title"></h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body"></div>
              </div>
          </div></form>`;

        const form = div.querySelector('form');
        form?.addEventListener('submit', (event) => {
            event.preventDefault();
            (form.elements.namedItem('okButton') as HTMLButtonElement)?.click();
            return false;
        });

        const titleE = div.querySelector<HTMLDivElement>('.modal-title');
        this.createContent(titleE, this.title);

        const bodyE = div.querySelector<HTMLDivElement>('.modal-body');
        this.createContent(bodyE, this.content);

        if (bodyE) {
            if (inputs) {
                inputs.classList.add('mt-3');
                bodyE.append(inputs);
            } else {
                if (type === 'switch') {
                    const switchDiv = document.createElement('div');
                    switchDiv.className = 'form-check form-switch mt-3';
                    switchDiv.innerHTML = `<input class="form-check-input" type="checkbox" value="true" id="flexSwitchCheckDefault">`;
                    input = switchDiv.querySelector('input');
                    bodyE.append(switchDiv);
                } else if (type === 'slider') {
                    const sdiv = document.createElement('div');
                    sdiv.className =
                        'input-group input-group-sm align-items-center mt-3';
                    sdiv.innerHTML = `<input class="form-control form-range" type="range" oninput="this.nextSibling.innerHTML = this.value"><label class="input-group-text"></label></div>`;
                    const sInput = sdiv.querySelector('input');
                    if (sInput?.nextElementSibling)
                        sInput.nextElementSibling.innerHTML = sInput.value;
                    input = sInput;
                    bodyE.append(sdiv);
                } else {
                    const myInput = document.createElement('input');
                    myInput.type = type ?? 'text';
                    myInput.required = true;
                    myInput.className = 'form-control mt-3';
                    myInput.addEventListener('change', () => setError(''));
                    input = myInput;
                    bodyE.append(myInput);
                }

                if (input) Object.assign(input, inputProps);
            }

            // Error display
            errorDiv = document.createElement('div');
            errorDiv.className = 'text-danger mt-3';
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
        const { type, content, title, inputProps = {} } = this;
        const { closable = true } = inputProps;

        // Div
        const div = document.createElement('div');
        div.className = 'toast';

        if (
            type === NotificationType.Danger ||
            type === NotificationType.Error ||
            type === NotificationType.Warning
        ) {
            div.role = 'alert';
            div.ariaLive = 'assertive';
        } else {
            div.role = 'status';
            div.ariaLive = 'polite';
        }

        div.innerHTML = `<div class="toast-header">
              <div class="rounded me-2 ${this.getColor(
                  type
              )}" style="width: 20px; height: 20px"></div>
              <strong class="toast-title me-auto"></strong>
              <small class="toast-tip"></small>
              ${
                  closable
                      ? `<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>`
                      : ''
              }
          </div>
          <div class="toast-body"></div>`;

        const titleE = div.querySelector<HTMLDivElement>('.toast-title');
        this.createContent(titleE, title);

        const bodyE = div.querySelector<HTMLDivElement>('.toast-body');
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
