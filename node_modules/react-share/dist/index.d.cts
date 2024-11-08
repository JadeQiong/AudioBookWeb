import { CSSProperties } from 'react';
import { FC } from 'react';
import { ForwardRefExoticComponent } from 'react';
import { HTMLAttributes } from 'react';
import { JSX as JSX_2 } from 'react';
import { default as React_2 } from 'react';
import { ReactNode } from 'react';
import { Ref } from 'react';
import { RefAttributes } from 'react';
import { SVGProps } from 'react';

declare interface CustomProps<LinkOptions> {
    /**
     *  Takes a function that returns a Promise to be fulfilled before calling
     * `onClick`. If you do not return promise, `onClick` is called immediately.
     */
    beforeOnClick?: () => Promise<void> | void;
    children: React_2.ReactNode;
    className?: string;
    /** Disables click action and adds `disabled` class */
    disabled?: boolean;
    /**
     * Style when button is disabled
     * @default { opacity: 0.6 }
     */
    disabledStyle?: React_2.CSSProperties;
    forwardedRef?: Ref<HTMLButtonElement>;
    /**
     * Passes as the native `title` atribute for the `button` element.
     */
    htmlTitle?: HTMLButtonElement['title'];
    networkName: string;
    networkLink: NetworkLink<LinkOptions>;
    onClick?: (event: React_2.MouseEvent<HTMLButtonElement>, link: string) => void;
    /**
     * Takes a function to be called after closing share dialog.
     */
    onShareWindowClose?: () => void;
    openShareDialogOnClick?: boolean;
    opts: LinkOptions;
    resetButtonStyle?: boolean;
    /**
     * URL of the shared page
     */
    url: string;
    style?: React_2.CSSProperties;
    windowWidth?: number;
    windowHeight?: number;
    windowPosition?: WindowPosition;
}

export declare const EmailIcon: FC<Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
    bgStyle?: CSSProperties | undefined;
    borderRadius?: number | undefined;
    iconFillColor?: string | undefined;
    round?: boolean | undefined;
    size?: string | number | undefined;
}>;

export declare const EmailShareButton: ForwardRefExoticComponent<Omit<Props<Options>, "forwardedRef" | "networkName" | "networkLink" | "opts"> & Options & RefAttributes<HTMLButtonElement>>;

export declare const FacebookIcon: FC<Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
    bgStyle?: CSSProperties | undefined;
    borderRadius?: number | undefined;
    iconFillColor?: string | undefined;
    round?: boolean | undefined;
    size?: string | number | undefined;
}>;

export declare const FacebookMessengerIcon: FC<Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
    bgStyle?: CSSProperties | undefined;
    borderRadius?: number | undefined;
    iconFillColor?: string | undefined;
    round?: boolean | undefined;
    size?: string | number | undefined;
}>;

export declare const FacebookMessengerShareButton: ForwardRefExoticComponent<Omit<Props<Options_2>, "forwardedRef" | "networkName" | "networkLink" | "opts"> & Options_2 & RefAttributes<HTMLButtonElement>>;

export declare const FacebookShareButton: ForwardRefExoticComponent<Omit<Props<{
    hashtag?: string | undefined;
}>, "forwardedRef" | "networkName" | "networkLink" | "opts"> & {
    hashtag?: string | undefined;
} & RefAttributes<HTMLButtonElement>>;

export declare const FacebookShareCount: {
    (props: Omit<Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
        children?: ((shareCount: number) => ReactNode) | undefined;
        getCount: (url: string, callback: (shareCount?: number | undefined) => void) => void;
        url: string;
    }, "getCount">): JSX_2.Element;
    displayName: string;
};

export declare const GabIcon: FC<Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
    bgStyle?: CSSProperties | undefined;
    borderRadius?: number | undefined;
    iconFillColor?: string | undefined;
    round?: boolean | undefined;
    size?: string | number | undefined;
}>;

export declare const GabShareButton: ForwardRefExoticComponent<Omit<Props<{
    title?: string | undefined;
}>, "forwardedRef" | "networkName" | "networkLink" | "opts"> & {
    title?: string | undefined;
} & RefAttributes<HTMLButtonElement>>;

export declare const HatenaIcon: FC<Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
    bgStyle?: CSSProperties | undefined;
    borderRadius?: number | undefined;
    iconFillColor?: string | undefined;
    round?: boolean | undefined;
    size?: string | number | undefined;
}>;

export declare const HatenaShareButton: ForwardRefExoticComponent<Omit<Props<{
    title?: string | undefined;
}>, "forwardedRef" | "networkName" | "networkLink" | "opts"> & {
    title?: string | undefined;
} & RefAttributes<HTMLButtonElement>>;

export declare const HatenaShareCount: {
    (props: Omit<Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
        children?: ((shareCount: number) => ReactNode) | undefined;
        getCount: (url: string, callback: (shareCount?: number | undefined) => void) => void;
        url: string;
    }, "getCount">): JSX_2.Element;
    displayName: string;
};

export declare const InstapaperIcon: FC<Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
    bgStyle?: CSSProperties | undefined;
    borderRadius?: number | undefined;
    iconFillColor?: string | undefined;
    round?: boolean | undefined;
    size?: string | number | undefined;
}>;

export declare const InstapaperShareButton: ForwardRefExoticComponent<Omit<Props<{
    title?: string | undefined;
    description?: string | undefined;
}>, "forwardedRef" | "networkName" | "networkLink" | "opts"> & {
    title?: string | undefined;
    description?: string | undefined;
} & RefAttributes<HTMLButtonElement>>;

export declare const LineIcon: FC<Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
    bgStyle?: CSSProperties | undefined;
    borderRadius?: number | undefined;
    iconFillColor?: string | undefined;
    round?: boolean | undefined;
    size?: string | number | undefined;
}>;

export declare const LineShareButton: ForwardRefExoticComponent<Omit<Props<{
    title?: string | undefined;
}>, "forwardedRef" | "networkName" | "networkLink" | "opts"> & {
    title?: string | undefined;
} & RefAttributes<HTMLButtonElement>>;

export declare const LinkedinIcon: FC<Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
    bgStyle?: CSSProperties | undefined;
    borderRadius?: number | undefined;
    iconFillColor?: string | undefined;
    round?: boolean | undefined;
    size?: string | number | undefined;
}>;

export declare const LinkedinShareButton: ForwardRefExoticComponent<Omit<Props<Options_3>, "forwardedRef" | "networkName" | "networkLink" | "opts"> & Options_3 & RefAttributes<HTMLButtonElement>>;

export declare const LivejournalIcon: FC<Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
    bgStyle?: CSSProperties | undefined;
    borderRadius?: number | undefined;
    iconFillColor?: string | undefined;
    round?: boolean | undefined;
    size?: string | number | undefined;
}>;

export declare const LivejournalShareButton: ForwardRefExoticComponent<Omit<Props<{
    title?: string | undefined;
    description?: string | undefined;
}>, "forwardedRef" | "networkName" | "networkLink" | "opts"> & {
    title?: string | undefined;
    description?: string | undefined;
} & RefAttributes<HTMLButtonElement>>;

export declare const MailruIcon: FC<Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
    bgStyle?: CSSProperties | undefined;
    borderRadius?: number | undefined;
    iconFillColor?: string | undefined;
    round?: boolean | undefined;
    size?: string | number | undefined;
}>;

export declare const MailruShareButton: ForwardRefExoticComponent<Omit<Props<{
    title?: string | undefined;
    description?: string | undefined;
    imageUrl?: string | undefined;
}>, "forwardedRef" | "networkName" | "networkLink" | "opts"> & {
    title?: string | undefined;
    description?: string | undefined;
    imageUrl?: string | undefined;
} & RefAttributes<HTMLButtonElement>>;

declare type NetworkLink<LinkOptions> = (url: string, options: LinkOptions) => string;

export declare const OKIcon: FC<Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
    bgStyle?: CSSProperties | undefined;
    borderRadius?: number | undefined;
    iconFillColor?: string | undefined;
    round?: boolean | undefined;
    size?: string | number | undefined;
}>;

export declare const OKShareButton: ForwardRefExoticComponent<Omit<Props<{
    title?: string | undefined;
    description?: string | undefined;
    image?: string | undefined;
}>, "forwardedRef" | "networkName" | "networkLink" | "opts"> & {
    title?: string | undefined;
    description?: string | undefined;
    image?: string | undefined;
} & RefAttributes<HTMLButtonElement>>;

export declare const OKShareCount: {
    (props: Omit<Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
        children?: ((shareCount: number) => ReactNode) | undefined;
        getCount: (url: string, callback: (shareCount?: number | undefined) => void) => void;
        url: string;
    }, "getCount">): JSX_2.Element;
    displayName: string;
};

declare type Options = {
    body?: string;
    separator?: string;
    subject?: string;
};

declare type Options_2 = {
    /** Your app's unique identifier. */
    appId: string;
    /** The URL to redirect to after a person clicks a button on the dialog.
     * Required when using URL redirection. */
    redirectUri?: string;
    /** A user ID of a recipient. Once the dialog comes up, the sender can
     * specify additional people as recipients. */
    to?: string;
};

declare type Options_3 = {
    /** The url-encoded title value that you wish you use. */
    title?: string;
    /** The url-encoded description that you wish you use. */
    summary?: string;
    /** The url-encoded source of the content (e.g. your website or application name) */
    source?: string;
};

declare type Options_4 = {
    title?: string;
    caption?: string;
    posttype?: 'link' | string;
};

declare type Options_5 = {
    title?: string;
    image?: string;
    noParse?: boolean;
    noVkLinks?: boolean;
};

export declare const PinterestIcon: FC<Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
    bgStyle?: CSSProperties | undefined;
    borderRadius?: number | undefined;
    iconFillColor?: string | undefined;
    round?: boolean | undefined;
    size?: string | number | undefined;
}>;

export declare const PinterestShareButton: ForwardRefExoticComponent<Omit<Props<PinterestShareProps>, "forwardedRef" | "networkName" | "networkLink" | "opts"> & PinterestShareProps & RefAttributes<HTMLButtonElement>>;

export declare const PinterestShareCount: {
    (props: Omit<Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
        children?: ((shareCount: number) => ReactNode) | undefined;
        getCount: (url: string, callback: (shareCount?: number | undefined) => void) => void;
        url: string;
    }, "getCount">): JSX_2.Element;
    displayName: string;
};

declare interface PinterestShareProps {
    media: string;
    description?: string;
    pinId?: string;
}

export declare const PocketIcon: FC<Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
    bgStyle?: CSSProperties | undefined;
    borderRadius?: number | undefined;
    iconFillColor?: string | undefined;
    round?: boolean | undefined;
    size?: string | number | undefined;
}>;

export declare const PocketShareButton: ForwardRefExoticComponent<Omit<Props<{
    title?: string | undefined;
}>, "forwardedRef" | "networkName" | "networkLink" | "opts"> & {
    title?: string | undefined;
} & RefAttributes<HTMLButtonElement>>;

declare type Props<LinkOptions extends Record<string, unknown>> = Omit<React_2.ButtonHTMLAttributes<HTMLButtonElement>, keyof CustomProps<LinkOptions>> & CustomProps<LinkOptions>;

export declare const RedditIcon: FC<Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
    bgStyle?: CSSProperties | undefined;
    borderRadius?: number | undefined;
    iconFillColor?: string | undefined;
    round?: boolean | undefined;
    size?: string | number | undefined;
}>;

export declare const RedditShareButton: ForwardRefExoticComponent<Omit<Props<{
    title?: string | undefined;
}>, "forwardedRef" | "networkName" | "networkLink" | "opts"> & {
    title?: string | undefined;
} & RefAttributes<HTMLButtonElement>>;

export declare const RedditShareCount: {
    (props: Omit<Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
        children?: ((shareCount: number) => ReactNode) | undefined;
        getCount: (url: string, callback: (shareCount?: number | undefined) => void) => void;
        url: string;
    }, "getCount">): JSX_2.Element;
    displayName: string;
};

export declare const TelegramIcon: FC<Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
    bgStyle?: CSSProperties | undefined;
    borderRadius?: number | undefined;
    iconFillColor?: string | undefined;
    round?: boolean | undefined;
    size?: string | number | undefined;
}>;

export declare const TelegramShareButton: ForwardRefExoticComponent<Omit<Props<{
    title?: string | undefined;
}>, "forwardedRef" | "networkName" | "networkLink" | "opts"> & {
    title?: string | undefined;
} & RefAttributes<HTMLButtonElement>>;

export declare const TumblrIcon: FC<Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
    bgStyle?: CSSProperties | undefined;
    borderRadius?: number | undefined;
    iconFillColor?: string | undefined;
    round?: boolean | undefined;
    size?: string | number | undefined;
}>;

export declare const TumblrShareButton: ForwardRefExoticComponent<Omit<Props<Options_4 & {
    tags: string;
}>, "forwardedRef" | "networkName" | "networkLink" | "opts"> & Options_4 & {
    tags?: string[] | undefined;
} & RefAttributes<HTMLButtonElement>>;

export declare const TumblrShareCount: {
    (props: Omit<Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
        children?: ((shareCount: number) => ReactNode) | undefined;
        getCount: (url: string, callback: (shareCount?: number | undefined) => void) => void;
        url: string;
    }, "getCount">): JSX_2.Element;
    displayName: string;
};

export declare const TwitterIcon: FC<Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
    bgStyle?: CSSProperties | undefined;
    borderRadius?: number | undefined;
    iconFillColor?: string | undefined;
    round?: boolean | undefined;
    size?: string | number | undefined;
}>;

export declare const TwitterShareButton: ForwardRefExoticComponent<Omit<Props<{
    title?: string | undefined;
    via?: string | undefined;
    hashtags?: string[] | undefined;
    related?: string[] | undefined;
}>, "forwardedRef" | "networkName" | "networkLink" | "opts"> & {
    title?: string | undefined;
    via?: string | undefined;
    hashtags?: string[] | undefined;
    related?: string[] | undefined;
} & RefAttributes<HTMLButtonElement>>;

export declare const ViberIcon: FC<Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
    bgStyle?: CSSProperties | undefined;
    borderRadius?: number | undefined;
    iconFillColor?: string | undefined;
    round?: boolean | undefined;
    size?: string | number | undefined;
}>;

export declare const ViberShareButton: ForwardRefExoticComponent<Omit<Props<{
    title?: string | undefined;
    separator?: string | undefined;
}>, "forwardedRef" | "networkName" | "networkLink" | "opts"> & {
    title?: string | undefined;
    separator?: string | undefined;
} & RefAttributes<HTMLButtonElement>>;

export declare const VKIcon: FC<Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
    bgStyle?: CSSProperties | undefined;
    borderRadius?: number | undefined;
    iconFillColor?: string | undefined;
    round?: boolean | undefined;
    size?: string | number | undefined;
}>;

export declare const VKShareButton: ForwardRefExoticComponent<Omit<Props<Options_5>, "forwardedRef" | "networkName" | "networkLink" | "opts"> & Options_5 & RefAttributes<HTMLButtonElement>>;

export declare const VKShareCount: {
    (props: Omit<Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
        children?: ((shareCount: number) => ReactNode) | undefined;
        getCount: (url: string, callback: (shareCount?: number | undefined) => void) => void;
        url: string;
    }, "getCount">): JSX_2.Element;
    displayName: string;
};

export declare const WeiboIcon: FC<Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
    bgStyle?: CSSProperties | undefined;
    borderRadius?: number | undefined;
    iconFillColor?: string | undefined;
    round?: boolean | undefined;
    size?: string | number | undefined;
}>;

export declare const WeiboShareButton: ForwardRefExoticComponent<Omit<Props<{
    title?: string | undefined;
    image?: string | undefined;
}>, "forwardedRef" | "networkName" | "networkLink" | "opts"> & {
    title?: string | undefined;
    image?: string | undefined;
} & RefAttributes<HTMLButtonElement>>;

export declare const WhatsappIcon: FC<Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
    bgStyle?: CSSProperties | undefined;
    borderRadius?: number | undefined;
    iconFillColor?: string | undefined;
    round?: boolean | undefined;
    size?: string | number | undefined;
}>;

export declare const WhatsappShareButton: ForwardRefExoticComponent<Omit<Props<{
    title?: string | undefined;
    separator?: string | undefined;
}>, "forwardedRef" | "networkName" | "networkLink" | "opts"> & {
    title?: string | undefined;
    separator?: string | undefined;
} & RefAttributes<HTMLButtonElement>>;

declare type WindowPosition = 'windowCenter' | 'screenCenter';

export declare const WorkplaceIcon: FC<Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
    bgStyle?: CSSProperties | undefined;
    borderRadius?: number | undefined;
    iconFillColor?: string | undefined;
    round?: boolean | undefined;
    size?: string | number | undefined;
}>;

export declare const WorkplaceShareButton: ForwardRefExoticComponent<Omit<Props<{
    quote?: string | undefined;
    hashtag?: string | undefined;
}>, "forwardedRef" | "networkName" | "networkLink" | "opts"> & {
    quote?: string | undefined;
    hashtag?: string | undefined;
} & RefAttributes<HTMLButtonElement>>;

export declare const XIcon: FC<Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
    bgStyle?: CSSProperties | undefined;
    borderRadius?: number | undefined;
    iconFillColor?: string | undefined;
    round?: boolean | undefined;
    size?: string | number | undefined;
}>;

export { }
