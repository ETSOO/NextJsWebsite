import React, { HtmlHTMLAttributes } from 'react';
import { ElementType } from 'react';

/**
 * HTML content props
 */
export type HtmlContentProps<T extends HTMLElement = HTMLDivElement> =
    HtmlHTMLAttributes<T> & {
        component?: ElementType;
        innerHTML: string;
    };

/**
 * HTML content
 * @param props Props
 * @returns Component
 */
export function HtmlContent(props: HtmlContentProps) {
    // Destruct
    const { component = 'div', innerHTML, ...rest } = props;

    const Component = component;

    // Layout
    return (
        <Component
            dangerouslySetInnerHTML={{ __html: innerHTML }}
            {...rest}
        ></Component>
    );
}
