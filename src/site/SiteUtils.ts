import { DataTypes } from '@etsoo/shared';
import enResources from '../i18n/en.json';
import zhHansResources from '../i18n/zh-Hans.json';
import zhHantResources from '../i18n/zh-Hant.json';

/**
 * Site utilities
 * 网站工具
 */
export namespace SiteUtils {
    /**
     * Get placement
     * @param p Placement
     * @returns Style classes
     */
    export function getPlacement(p: DataTypes.PlacementEnum) {
        switch (p) {
            case DataTypes.PlacementEnum.TopLeft:
                return 'top-0 start-0';
            case DataTypes.PlacementEnum.TopCenter:
                return 'top-0 start-50 translate-middle-x';
            case DataTypes.PlacementEnum.TopRight:
                return 'top-0 end-0';
            case DataTypes.PlacementEnum.MiddleLeft:
                return 'top-50 start-0 translate-middle-y';
            case DataTypes.PlacementEnum.Center:
                return 'top-50 start-50 translate-middle';
            case DataTypes.PlacementEnum.MiddleRight:
                return 'top-50 end-0 translate-middle-y';
            case DataTypes.PlacementEnum.BottomLeft:
                return 'bottom-0 start-0';
            case DataTypes.PlacementEnum.BottomCenter:
                return 'bottom-0 start-50 translate-middle-x';
            default:
                return 'bottom-0 end-0';
        }
    }

    const resources: DataTypes.StringRecord = {};

    /**
     * Get culture resource
     * @param key key
     * @returns Resource
     */
    export function get<T = string>(key: string): T | undefined {
        const value = resources[key];
        if (value == null) return undefined;

        // No strict type convertion here
        // Make sure the type is strictly match
        // Otherwise even request number, may still return the source string type
        return value as T;
    }

    /**
     * Get string resource
     * @param key key
     * @param defaultLabel Default label
     * @returns Resource
     */
    export function getLabel(key: string, defaultLabel?: string): string {
        return get<string>(key) ?? defaultLabel ?? key;
    }

    /**
     * Get multiple tring resources
     * @param keys Keys
     */
    export function getLabels<T extends string>(
        ...keys: T[]
    ): { [K in T]: string } {
        const init: any = {};
        return keys.reduce((a, v) => ({ ...a, [v]: getLabel(v) }), init);
    }

    /**
     * Setup
     * @param culture Culture, like zh-Hans
     * @param customResources Custom resurces
     */
    export function setup(
        culture: string,
        customResources: DataTypes.StringRecord
    ) {
        if (
            culture === 'zh-CN' ||
            culture === 'zh-SG' ||
            culture === 'zh-Hans' ||
            culture.startsWith('zh-Hans-')
        ) {
            Object.assign(resources, zhHansResources);
        } else if (culture.startsWith('zh-')) {
            Object.assign(resources, zhHantResources);
        } else if (culture === 'en' || culture.startsWith('en-')) {
            Object.assign(resources, enResources);
        }

        Object.assign(resources, customResources);
    }

    /**
     * Toggle button spinner show / hide
     * @param button Button
     * @param startSide In start side or not, default false
     */
    export function toggleButtonSpinner(
        button: HTMLButtonElement,
        startSide: boolean = false
    ) {
        let span = button.querySelector('.spinner-border');
        if (span == null) {
            span = document.createElement('span');
            span.className = `spinner-border spinner-border-sm ${
                startSide ? 'me-2' : 'ms-2'
            }`;
            span.role = 'status';

            startSide ? button.prepend(span) : button.append(span);

            button.disabled = true;
        } else {
            span.remove();
            button.disabled = false;
        }
    }
}
