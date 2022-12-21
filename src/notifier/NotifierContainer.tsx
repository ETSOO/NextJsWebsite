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
        [K in NotificationAlign]?: HTMLDivElement;
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

            // HTML id
            const hid = 'id' + id;

            const { Modal, Toast } = await import('bootstrap');

            // Modal
            if (modal || type in NotificationModalType) {
                if (dismiss) {
                    const div = document.querySelector(`div.modal#${hid}`);
                    if (div) {
                        const modal = Modal.getInstance(div);
                        if (modal) {
                            modal.hide();
                            modal.dispose();
                            div.remove();
                        }
                    }
                } else {
                    const nu = notification.render(props, itemClass);
                    if (nu) {
                        nu.classList.add('etsoo-notifier-modal');
                        nu.id = hid;
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
                wrapper = document.createElement('div');
                wrapper.className = `toast-container position-absolute p-3 ${SiteUtils.getPlacement(
                    align
                )}`;
                document.body.append(wrapper);
                this.wrappers[notification.align] = wrapper;
            }

            if (dismiss) {
                const nu = wrapper.querySelector(`#${hid}`);
                if (nu) {
                    const toast = Toast.getInstance(nu);
                    if (toast) {
                        toast.hide();
                        // Bug for version 5.2.3
                        // toast.dispose();
                        nu.remove();
                    }
                }
            } else {
                const nu = notification.render(props, itemClass);
                if (nu) {
                    nu.id = hid;
                    wrapper.append(nu);
                    Toast.getOrCreateInstance(nu, { autohide: false }).show();
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
