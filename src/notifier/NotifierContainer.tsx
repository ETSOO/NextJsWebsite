import {
    INotificaseBase,
    INotifier,
    NotificationAlign,
    NotificationContainer,
    NotificationModalType,
    NotificationRenderProps
} from '@etsoo/notificationbase';
import { SiteUtils } from '../site/SiteUtils';
import {
    INotificationDom,
    NotificationDom,
    NotificationDomCallProps
} from './NotificationDom';

/**
 * Notifier container interface
 */
export interface INotifierContainer
    extends INotifier<HTMLDivElement, NotificationDomCallProps> {}

/**
 * Notifier container
 */
export class NotifierContainer
    extends NotificationContainer<HTMLDivElement, NotificationDomCallProps>
    implements INotifierContainer
{
    private wrappers: {
        [K in NotificationAlign]?: [HTMLDivElement, HTMLDivElement];
    } = {};

    /**
     * Constructor
     * @param props Renderer properties
     * @param className Style class name
     */
    constructor(props: NotificationRenderProps = {}, className?: string) {
        // Item class
        const itemClass = className ? className + '-item' : className;

        // Super constructor
        super(async (notification, dismiss) => {
            // Notification creation or dismiss
            // Destruct
            const { id, modal, type } = notification;

            const { Modal, Toast } = await import('bootstrap');

            // Modal
            if (modal || type in NotificationModalType) {
                if (dismiss) {
                    const div = document.querySelector(`div.modal#${id}`);
                    if (div) div.remove();
                } else {
                    const nu = notification.render(props, itemClass);
                    if (nu) {
                        nu.classList.add('etsoo-notifier-modal');
                        nu.id = id;
                        document.body.appendChild(nu);

                        Modal.getOrCreateInstance(nu).show();
                    }
                }
                return;
            }

            // Message / toast

            // Align
            const align = notification.align;

            // Wrapper
            let wrapper = this.wrappers[align];
            if (wrapper == null) {
                const div = document.createElement('div');
                div.className = 'position-relative etsoo-notifier-wrapper';
                div.innerHTML = `<div class="toast-container position-absolute p-3 ${SiteUtils.getPlacement(
                    align
                )}"></div>`;
                document.body.append(div);

                const firstChild =
                    div.firstElementChild as HTMLDivElement | null;
                if (firstChild == null) {
                    throw new Error(
                        `No DIV element in the wrapper ${notification.align}`
                    );
                }

                wrapper = [div, firstChild];
                this.wrappers[notification.align] = wrapper;
            }

            // Container
            const container = wrapper[1];
            if (dismiss) {
                const nu = container.querySelector(`#${id}`);
                if (nu) nu.remove();
            } else {
                const nu = notification.render(props, itemClass);
                if (nu) {
                    nu.id = id;
                    container.append(nu);
                    Toast.getOrCreateInstance(nu).show();
                }
            }
        });
    }

    protected addRaw(
        data: INotificaseBase<HTMLDivElement, NotificationDomCallProps>,
        modal?: boolean | undefined
    ): INotificationDom {
        // Destruct
        const {
            type,
            content,
            title,
            align,
            timespan = modal ? 0 : undefined,
            ...rest
        } = data;

        // Setup
        const n = new NotificationDom(type, content, title, align, timespan);

        // Assign other properties
        Object.assign(n, rest);

        // Is modal
        if (modal != null) n.modal = modal;

        // Add to the collection
        this.add(n);

        // Return
        return n;
    }
}
