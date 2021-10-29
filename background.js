let BACKGROUND = (function() {
    let self = {};
    self.page = {};

    // used to identify elements on the page
    self.elements = {
        'overlayTop': {
            state: {
                status: 'searching',
                selector: null
            },
            search: {
                xpath: "//div[@role='main']/div/div/div/div[@data-pagelet='TahoeVideo']/div/div/div[2]/div/div[div/span[text()='LIVE']]"
            }
        },
        'overlayBottom': {
            state: {
                status: 'searching',
                selector: null
            },
            search: {
                xpath: "//div[@role='main']/div/div/div/div[@data-pagelet='TahoeVideo']/div/div/div[2]/div/div[div/div/span/span/span/div[@aria-label='Pause']|div[@aria-label='Play']]"
            }
        },
        'chatPanel': {
            state: {
                status: 'searching',
                selector: null
            },
            search: {
                xpath: "//div[@role='complementary']"
            }
        },
        'chatHeader': {
            state: {
                status: 'searching',
                selector: null
            },
            search: {
                xpath: "//div[div/div/div/div/div/div/div/span/span[text()='Live Chat']]"
            }
        },
        'chatPinned': {
            state: {
                status: 'searching',
                selector: null
            },
            search: {
                xpath: "//div[div[text()='Pinned Comment']]"
            }
        },
        'emojiStream': {
            state: {
                status: 'searching',
                selector: null
            },
            search: {
                xpath: "./div/div/div/div[@data-pagelet='TahoeRightRail']/div/div[2]/div/div/div[2]",
                context: 'chatPanel'
            }
        },
        'comment': {
            state: {
                status: 'searching',
                selector: null
            },
            search: {
                xpath: "//div[@role='article'][contains(@aria-label,'Comment by ')]"
            }
        },
        'commentInner': {
            state: {
                status: 'searching',
                selector: null
            },
            search: {
                xpath: "./div[2]",
                context: 'comment'
            }
        },
        'avatar': {
            state: {
                status: 'searching',
                selector: null
            },
            search: {
                xpath: "./div[1]/span/a/div",
                context: 'comment'
            }
        },
        'sticker': {
            state: {
                status: 'searching',
                selector: null
            },
            search: {
                xpath: "//div[@role='button'][contains(@aria-label,'sticker')][img[contains(@alt,'sticker')]]",
            }
        },
        'commentBubble': {
            state: {
                status: 'searching',
                selector: null
            },
            search: {
                xpath: "./div/div/div/div/div",
                context: 'commentInner'
            }
        },
        'commentBubbleInner': {
            state: {
                status: 'searching',
                selector: null
            },
            search: {
                xpath: "./div",
                context: 'commentBubble'
            }
        },
        'commentName': {
            state: {
                status: 'searching',
                selector: null
            },
            search: {
                xpath: "./div[1]/span/a/span/span[@dir='auto']",
                context: 'commentBubbleInner'
            }
        },
        'mention': {
            state: {
                status: 'searching',
                selector: null
            },
            search: {
                xpath: "//div[@role='article'][contains(@aria-label,'Comment by ')]/div[2]/div/div/div/div/div/div/div[2]/span/div/div/a[@role='link']"
            }
        },
        'commentReactions': {
            state: {
                status: 'searching',
                selector: null
            },
            search: {
                xpath: "./div/div/div/div[2]/div/span/div[contains(@aria-label,'see who reacted to this')]",
                context: 'commentInner'
            }
        },
        'commentLinks': {
            state: {
                status: 'searching',
                selector: null
            },
            search: {
                xpath: "./div/ul[li/span/div/span/div[@aria-label='Like']]",
                context: 'comment'
            }
        }
    };

    // defines the controls used to modify the page
    self.controls = {
        overlayStatusSize: {
            name: 'Stats Size',
            state: {
                status: 'searching',
                enabled: false,
                selected: null
            },
            options: [
                'Normal',
                'Small',
                'Tiny'
            ],
            dependencies: [
                'overlayTop'
            ],
            generateStyles: (selected) => {
                if (selected === null || selected === 'Normal') {
                    return undefined;
                }

                let overlayTop = self.elements.overlayTop;
                if (overlayTop === undefined) {
                    console.log('ERROR: Element overlayTop does not exist.');
                    return undefined;
                } else if (overlayTop.state.selector === null) {
                    console.log('ERROR: Element overlayTop not yet detected.');
                    return undefined;
                }

                if (selected === 'Small') {
                    return `
${overlayTop.state.selector} {
    height: 16px;
}

${overlayTop.state.selector} span {
    font-size: 0.5rem;
}`
                } else if (selected === 'Tiny') {
                    return `
${overlayTop.state.selector} {
    height: 12px;
}

${overlayTop.state.selector} span {
    font-size: 0.35rem;
}`
                }

                return undefined;
            }
        },
        overlayOpacity: {
            name: 'Opacity',
            state: {
                status: 'searching',
                enabled: false,
                selected: null
            },
            options: [
                '100%',
                '75%',
                '50%',
                '25%',
                '10%',
                '0%'
            ],
            dependencies: [
                'overlayTop',
                'overlayBottom'
            ],
            generateStyles: (selected) => {
                if (selected === null || selected === '100%') {
                    return undefined;
                }

                let overlayTop = self.elements.overlayTop;
                if (overlayTop === undefined) {
                    console.log('ERROR: Element overlayTop does not exist.');
                    return undefined;
                } else if (overlayTop.state.selector === null) {
                    console.log('ERROR: Element overlayTop not yet detected.');
                    return undefined;
                }

                let overlayBottom = self.elements.overlayBottom;
                if (overlayBottom === undefined) {
                    console.log('ERROR: Element overlayBottom does not exist.');
                    return undefined;
                } else if (overlayBottom.state.selector === null) {
                    console.log('ERROR: Element overlayBottom not yet detected.');
                    return undefined;
                }

                if (selected === '75%'
                        || selected === '50%'
                        || selected === '25%'
                        || selected === '10%'
                        || selected === '0%') {
                    return `
${overlayTop.state.selector},
${overlayBottom.state.selector} {
    opacity: ${selected};
}`
                }

                return undefined;
            }
        },
        chatPanel: {
            name: 'Chat Panel',
            state: {
                status: 'searching',
                enabled: false,
                selected: null
            },
            options: [
                'Show',
                'Hide'
            ],
            dependencies: [
                'chatPanel'
            ],
            generateStyles: (selected) => {
                if (selected === null || selected === 'Show') {
                    return undefined;
                }

                let chatPanel = self.elements.chatPanel;
                if (chatPanel === undefined) {
                    console.log('ERROR: Element chatPanel does not exist.');
                    return undefined;
                } else if (chatPanel.state.selector === null) {
                    console.log('ERROR: Element chatPanel not yet detected.');
                    return undefined;
                }

                if (selected === 'Hide') {
                    return `
${chatPanel.state.selector} {
    display: none;
}`
                }

                return undefined;
            }
        },
        chatHeader: {
            name: 'Header',
            state: {
                status: 'searching',
                enabled: false,
                selected: null
            },
            options: [
                'Show',
                'Hide'
            ],
            dependencies: [
                'chatHeader'
            ],
            generateStyles: (selected) => {
                if (selected === null || selected === 'Show') {
                    return undefined;
                }

                let chatHeader = self.elements.chatHeader;
                if (chatHeader === undefined) {
                    console.log('ERROR: Element chatHeader does not exist.');
                    return undefined;
                } else if (chatHeader.state.selector === null) {
                    console.log('ERROR: Element chatHeader not yet detected.');
                    return undefined;
                }

                if (selected === 'Hide') {
                    return `
${chatHeader.state.selector} {
    display: none;
}`
                }

                return undefined;
            }
        },
        chatPinned: {
            name: 'Pinned',
            state: {
                status: 'searching',
                enabled: false,
                selected: null
            },
            options: [
                'Show',
                'Hide'
            ],
            dependencies: [
                'chatPinned'
            ],
            generateStyles: (selected) => {
                if (selected === null || selected === 'Show') {
                    return undefined;
                }

                let chatPinned = self.elements.chatPinned;
                if (chatPinned === undefined) {
                    console.log('ERROR: Element chatPinned does not exist.');
                    return undefined;
                } else if (chatPinned.state.selector === null) {
                    console.log('ERROR: Element chatPinned not yet detected.');
                    return undefined;
                }

                if (selected === 'Hide') {
                    return `
${chatPinned.state.selector} {
    display: none;
}`
                }

                return undefined;
            }
        },
        chatEmojiStreamOpacity: {
            name: 'Emoji Stream Opacity',
            state: {
                status: 'searching',
                enabled: false,
                selected: null
            },
            options: [
                '100%',
                '75%',
                '50%',
                '25%',
                '10%',
                '0%'
            ],
            dependencies: [
                'emojiStream'
            ],
            generateStyles: (selected) => {
                if (selected === null || selected === '100%') {
                    return undefined;
                }

                let emojiStream = self.elements.emojiStream;
                if (emojiStream === undefined) {
                    console.log('ERROR: Element emojiStream does not exist.');
                    return undefined;
                } else if (emojiStream.state.selector === null) {
                    console.log('ERROR: Element emojiStream not yet detected.');
                    return undefined;
                }

                if (selected === '75%'
                        || selected === '50%'
                        || selected === '25%'
                        || selected === '10%'
                        || selected === '0%') {
                    return `
${emojiStream.state.selector} {
    opacity: ${selected};
}`
                }

                return undefined;
            }
        },
        commentAvatarSize: {
            name: 'Avatar Size',
            state: {
                status: 'searching',
                enabled: false,
                selected: null
            },
            options: [
                'Normal',
                'Small',
                'Tiny',
                'Micro',
                'Hide'
            ],
            dependencies: [
                'avatar'
            ],
            generateStyles: (selected) => {
                if (selected === null || selected === 'Normal') {
                    return undefined;
                }

                let avatar = self.elements.avatar;
                if (avatar === undefined) {
                    console.log('ERROR: Element avatar does not exist.');
                    return undefined;
                } else if (avatar.state.selector === null) {
                    console.log('ERROR: Element avatar not yet detected.');
                    return undefined;
                }

                if (selected === 'Small') {
                    return `
${avatar.state.selector} > svg,
${avatar.state.selector} > svg image {
    height: 24px !important;
    width: 24px !important;
}

${avatar.state.selector} > svg circle {
    cx: 12;
    cy: 12;
    r: 12;
}`
                } else if (selected === 'Tiny') {
                    return `
${avatar.state.selector} > svg,
${avatar.state.selector} > svg image {
    height: 16px !important;
    width: 16px !important;
}

${avatar.state.selector} > svg circle {
    cx: 8;
    cy: 8;
    r: 8;
}`
                } else if (selected === 'Micro') {
                    return `
${avatar.state.selector} > svg,
${avatar.state.selector} > svg image {
    height: 8px !important;
    width: 8px !important;
}

${avatar.state.selector} > svg circle {
    cx: 4;
    cy: 4;
    r: 4;
}`
                } else if (selected === 'Hide') {
                    return `
${avatar.state.selector} {
    display: none;
}`
                }

                return undefined;
            }
        },
        commentAvatarShape: {
            name: 'Avatar Shape',
            state: {
                status: 'searching',
                enabled: false,
                selected: null
            },
            options: [
                'Cricle',
                'Square'
            ],
            dependencies: [
                'avatar'
            ],
            generateStyles: (selected) => {
                if (selected === null || selected === 'Circle') {
                    return undefined;
                }

                let avatar = self.elements.avatar;
                if (avatar === undefined) {
                    console.log('ERROR: Element avatar does not exist.');
                    return undefined;
                } else if (avatar.state.selector === null) {
                    console.log('ERROR: Element avatar not yet detected.');
                    return undefined;
                }

                if (selected === 'Square') {
                    return `
${avatar.state.selector} > svg mask {
    display: none;
}`
                }

                return undefined;
            }
        },
        commentStickerSize: {
            name: 'Sticker Size',
            state: {
                status: 'searching',
                enabled: false,
                selected: null
            },
            options: [
                'Normal',
                'Small',
                'Tiny',
                'Micro'
            ],
            dependencies: [
                'sticker'
            ],
            generateStyles: (selected) => {
                if (selected === null || selected === 'Normal') {
                    return undefined;
                }

                let sticker = self.elements.sticker;
                if (sticker === undefined) {
                    console.log('ERROR: Element sticker does not exist.');
                    return undefined;
                } else if (sticker.state.selector === null) {
                    console.log('ERROR: Element sticker not yet detected.');
                    return undefined;
                }

                if (selected === 'Small') {
                    return `
${sticker.state.selector} {
    height: 60px !important;
    width: 60px !important;
}`
                } else if (selected === 'Tiny') {
                    return `
${sticker.state.selector} {
    height: 40px !important;
    width: 40px !important;
}`
                } else if (selected === 'Micro') {
                    return `
${sticker.state.selector} {
    height: 20px !important;
    width: 20px !important;
}`
                }

                return undefined;
            }
        },
        commentMargins: {
            name: 'Margins',
            state: {
                status: 'searching',
                enabled: false,
                selected: null
            },
            options: [
                'Normal',
                'Small',
                'Tiny',
                'None'
            ],
            dependencies: [
                'comment',
                'commentInner'
            ],
            generateStyles: (selected) => {
                if (selected === null || selected === 'Normal') {
                    return undefined;
                }

                let comment = self.elements.comment;
                if (comment === undefined) {
                    console.log('ERROR: Element comment does not exist.');
                    return undefined;
                } else if (comment.state.selector === null) {
                    console.log('ERROR: Element comment not yet detected.');
                    return undefined;
                }

                let commentInner = self.elements.commentInner;
                if (commentInner === undefined) {
                    console.log('ERROR: Element commentInner does not exist.');
                    return undefined;
                } else if (commentInner.state.selector === null) {
                    console.log('ERROR: Element commentInner not yet detected.');
                    return undefined;
                }

                if (selected === 'Small') {
                    return `
${comment.state.selector} {
    padding: 4px 8px;
}

${commentInner.state.selector} {
    padding-right: 8px;
}`
                } else if (selected === 'Tiny') {
                    return `
${comment.state.selector} {
    padding: 2px 4px;
}

${commentInner.state.selector} {
    padding-right: 4px;
}`
                } else if (selected === 'None') {
                    return `
${comment.state.selector} {
    padding: 0;
}

${commentInner.state.selector} {
    padding-right: 0;
}`
                }

                return undefined;
            }
        },
        commentPadding: {
            name: 'Padding',
            state: {
                status: 'searching',
                enabled: false,
                selected: null
            },
            options: [
                'Normal',
                'Small',
                'Tiny',
                'None'
            ],
            dependencies: [
                'commentBubble',
                'commentBubbleInner'
            ],
            generateStyles: (selected) => {
                if (selected === null || selected === 'Normal') {
                    return undefined;
                }

                let commentBubble = self.elements.commentBubble;
                if (commentBubble === undefined) {
                    console.log('ERROR: Element commentBubble does not exist.');
                    return undefined;
                } else if (commentBubble.state.selector === null) {
                    console.log('ERROR: Element commentBubble not yet detected.');
                    return undefined;
                }

                let commentBubbleInner = self.elements.commentBubbleInner;
                if (commentBubbleInner === undefined) {
                    console.log('ERROR: Element commentBubbleInner does not exist.');
                    return undefined;
                } else if (commentBubbleInner.state.selector === null) {
                    console.log('ERROR: Element commentBubbleInner not yet detected.');
                    return undefined;
                }

                if (selected === 'Small') {
                    return `
${commentBubble.state.selector} {
    border-radius: 12px;
}

${commentBubbleInner.state.selector} {
    padding: 6px 9px;
}`
                } else if (selected === 'Tiny') {
                    return `
${commentBubble.state.selector} {
    border-radius: 6px;
}

${commentBubbleInner.state.selector} {
    padding: 3px 4px;
}`
                } else if (selected === 'None') {
                    return `
${commentBubble.state.selector} {
    border-radius: 0;
}

${commentBubbleInner.state.selector} {
    padding: 0;
}`
                }

                return undefined;
            }
        },
        commentNameColor: {
            name: 'Name Color',
            state: {
                status: 'searching',
                enabled: false,
                selected: null
            },
            options: [
                'Normal',
                'Blue',
                'Purple',
                'Red',
                'Orange',
                'Yellow',
                'Green',
                'Black',
                'White',
                'Grey'
            ],
            dependencies: [
                'commentName'
            ],
            generateStyles: (selected) => {
                if (selected === null || selected === 'Normal') {
                    return undefined;
                }

                let commentName = self.elements.commentName;
                if (commentName === undefined) {
                    console.log('ERROR: Element commentName does not exist.');
                    return undefined;
                } else if (commentName.state.selector === null) {
                    console.log('ERROR: Element commentName not yet detected.');
                    return undefined;
                }

                if (selected === 'Blue') {
                    return `
${commentName.state.selector} {
    color: var(--blue-link);
}`
                } else if (selected === 'Purple') {
                    return `
${commentName.state.selector} {
    color: var(--base-grape);
}`
                } else if (selected === 'Red') {
                    return `
${commentName.state.selector} {
    color: var(--base-cherry);
}`
                } else if (selected === 'Orange') {
                    return `
${commentName.state.selector} {
    color: var(--base-tomato);
}`
                } else if (selected === 'Yellow') {
                    return `
${commentName.state.selector} {
    color: var(--base-lemon);
}`
                } else if (selected === 'Green') {
                    return `
${commentName.state.selector} {
    color: var(--base-lime);
}`
                } else if (selected === 'Black') {
                    return `
${commentName.state.selector} {
    color: var(--always-black);
}`
                } else if (selected === 'White') {
                    return `
${commentName.state.selector} {
    color: var(--always-white);
}`
                } else if (selected === 'Grey') {
                    return `
${commentName.state.selector} {
    color: var(--always-gray-40);
}`
                }

                return undefined;
            }
        },
        commentAtOnMentions: {
            name: '@ on Mentions',
            state: {
                status: 'searching',
                enabled: false,
                selected: null
            },
            options: [
                'Hide',
                'Show'
            ],
            dependencies: [
                'mention'
            ],
            generateStyles: (selected) => {
                if (selected === null || selected === 'Hide') {
                    return undefined;
                }

                let mention = self.elements.mention;
                if (mention === undefined) {
                    console.log('ERROR: Element mention does not exist.');
                    return undefined;
                } else if (mention.state.selector === null) {
                    console.log('ERROR: Element mention not yet detected.');
                    return undefined;
                }

                if (selected === 'Show') {
                    return `
${mention.state.selector}::before {
    content: '@';
}`
                }

                return undefined;
            }
        },
        commentMentionColor: {
            name: 'Mention Color',
            state: {
                status: 'searching',
                enabled: false,
                selected: null
            },
            options: [
                'Normal',
                'Blue',
                'Purple',
                'Red',
                'Orange',
                'Yellow',
                'Green',
                'Black',
                'White',
                'Grey'
            ],
            dependencies: [
                'mention'
            ],
            generateStyles: (selected) => {
                if (selected === null || selected === 'Normal') {
                    return undefined;
                }

                let mention = self.elements.mention;
                if (mention === undefined) {
                    console.log('ERROR: Element mention does not exist.');
                    return undefined;
                } else if (mention.state.selector === null) {
                    console.log('ERROR: Element mention not yet detected.');
                    return undefined;
                }

                if (selected === 'Blue') {
                    return `
${mention.state.selector} {
    color: var(--blue-link);
}`
                } else if (selected === 'Purple') {
                    return `
${mention.state.selector} {
    color: var(--base-grape);
}`
                } else if (selected === 'Red') {
                    return `
${mention.state.selector} {
    color: var(--base-cherry);
}`
                } else if (selected === 'Orange') {
                    return `
${mention.state.selector} {
    color: var(--base-tomato);
}`
                } else if (selected === 'Yellow') {
                    return `
${mention.state.selector} {
    color: var(--base-lemon);
}`
                } else if (selected === 'Green') {
                    return `
${mention.state.selector} {
    color: var(--base-lime);
}`
                } else if (selected === 'Black') {
                    return `
${mention.state.selector} {
    color: var(--always-black);
}`
                } else if (selected === 'White') {
                    return `
${mention.state.selector} {
    color: var(--always-white);
}`
                } else if (selected === 'Grey') {
                    return `
${mention.state.selector} {
    color: var(--always-gray-40);
}`
                }

                return undefined;
            }
        },
        commentReactions: {
            name: 'Reactions',
            state: {
                status: 'searching',
                enabled: false,
                selected: null
            },
            options: [
                'Show',
                'Hide'
            ],
            dependencies: [
                'commentReactions'
            ],
            generateStyles: (selected) => {
                if (selected === null || selected === 'Show') {
                    return undefined;
                }

                let commentReactions = self.elements.commentReactions;
                if (commentReactions === undefined) {
                    console.log('ERROR: Element commentReactions does not exist.');
                    return undefined;
                } else if (commentReactions.state.selector === null) {
                    console.log('ERROR: Element commentReactions not yet detected.');
                    return undefined;
                }

                if (selected === 'Hide') {
                    return `
${commentReactions.state.selector} {
    display: none;
}`
                }

                return undefined;
            }
        },
        commentLinksLike: {
            name: 'Like',
            state: {
                status: 'searching',
                enabled: false,
                selected: null
            },
            options: [
                'Show',
                'Hide'
            ],
            dependencies: [
                'commentLinks'
            ],
            generateStyles: (selected) => {
                if (selected === null || selected === 'Show') {
                    return undefined;
                }

                let commentLinks = self.elements.commentLinks;
                if (commentLinks === undefined) {
                    console.log('ERROR: Element commentLinks does not exist.');
                    return undefined;
                } else if (commentLinks.state.selector === null) {
                    console.log('ERROR: Element commentLinks not yet detected.');
                    return undefined;
                }

                if (selected === 'Hide') {
                    return `
${commentLinks.state.selector} li:first-child {
    display: none;
}

${commentLinks.state.selector} li:nth-child(2) span {
    display: none;
}`
                }

                return undefined;
            }
        },
        commentLinksTimestamp: {
            name: 'Timestamp',
            state: {
                status: 'searching',
                enabled: false,
                selected: null
            },
            options: [
                'Show',
                'Hide'
            ],
            dependencies: [
                'commentLinks'
            ],
            generateStyles: (selected) => {
                if (selected === null || selected === 'Show') {
                    return undefined;
                }

                let commentLinks = self.elements.commentLinks;
                if (commentLinks === undefined) {
                    console.log('ERROR: Element commentLinks does not exist.');
                    return undefined;
                } else if (commentLinks.state.selector === null) {
                    console.log('ERROR: Element commentLinks not yet detected.');
                    return undefined;
                }

                if (selected === 'Hide') {
                    return `
${commentLinks.state.selector} li:last-child {
    display: none;
}`
                }

                return undefined;
            }
        },
        commentLinksLocation: {
            name: 'Location',
            state: {
                status: 'searching',
                enabled: false,
                selected: null
            },
            options: [
                'Normal',
                'Right',
                'Hide'
            ],
            dependencies: [
                'commentReactions',
                'commentLinks'
            ],
            generateStyles: (selected) => {
                if (selected === null || selected === 'Normal') {
                    return undefined;
                }

                let commentReactions = self.elements.commentReactions;
                let commentLinks = self.elements.commentLinks;
                if (commentLinks === undefined) {
                    console.log('ERROR: Element commentLinks does not exist.');
                    return undefined;
                } else if (commentLinks.state.selector === null) {
                    console.log('ERROR: Element commentLinks not yet detected.');
                    return undefined;
                }

                if (selected === 'Right') {
                    let reactionsOffset = 195;
                    if (self.controls.commentMargins.state.enabled) {
                        reactionsOffset = {
                            'Normal': 195,
                            'Small': 220,
                            'Tiny': 232,
                            'None': 243
                        }[self.controls.commentMargins.state.selected] || 195;
                    }

                    let result = `
${commentLinks.state.selector} {
    display: block;
    float: right;
    margin-top: -10px;
    position: relative;
    text-align: right;
}`

                    if (commentReactions !== undefined
                            && commentReactions.state.selector !== null) {
                        result += `
${commentReactions.state.selector} {
    right: ${reactionsOffset}px;
}`
                    }

                    return result;
                } else if (selected === 'Hide') {
                    let result = `
${commentLinks.state.selector} {
    display: none;
}`

                    if (commentReactions !== undefined
                            && commentReactions.state.selector !== null) {
                        result += `
${commentReactions.state.selector} {
    bottom: 9px;
}`
                    }

                    return result;
                }

                return undefined;
            }
        },
        commentLinksOpacity: {
            name: 'Opacity',
            state: {
                status: 'searching',
                enabled: false,
                selected: null
            },
            options: [
                '100%',
                '75%',
                '50%',
                '25%',
                '10%',
                '0%'
            ],
            dependencies: [
                'commentLinks'
            ],
            generateStyles: (selected) => {
                if (selected === null || selected === '100%') {
                    return undefined;
                }

                let commentLinks = self.elements.commentLinks;
                if (commentLinks === undefined) {
                    console.log('ERROR: Element commentLinks does not exist.');
                    return undefined;
                } else if (commentLinks.state.selector === null) {
                    console.log('ERROR: Element commentLinks not yet detected.');
                    return undefined;
                }

                if (selected === '75%'
                        || selected === '50%'
                        || selected === '25%'
                        || selected === '10%'
                        || selected === '0%') {
                    return `
${commentLinks.state.selector} {
    opacity: ${selected};
}`
                }

                return undefined;
            }
        }
    };

    /**
     * Stores current controls details.
     */
    self.storeControls = () => {
        let controls = {};
        Object.entries(self.controls).every(([controlId, control]) => {
            controls[controlId] = {
                name: control.name,
                state: control.state,
                options: control.options
            };

            return true;
        });

        chrome.storage.local.set({ controls });
    };

    /**
     * Stores current control states so they can be recovered for future
     * browser sessions.
     */
    self.storeOldControlStates = () => {
        let oldControlStates = {};
        Object.entries(self.controls).every(([controlId, control]) => {
            if (control.state.status === 'detected'
                    || control.state.status === 'searching-with-store') {
                oldControlStates[controlId] = {
                    enabled: control.state.enabled,
                    selected: control.state.selected
                };
            }

            return true;
        });

        chrome.storage.local.set({ oldControlStates });
    };

    /**
     * Stores element selectors so they can be recovered for future browser
     * sessions.
     */
    self.storeOldElementSelectors = () => {
        let oldElementSelectors = {};
        Object.entries(self.elements).every(([elementId, element]) => {
            oldElementSelectors[elementId] = element.state.selector;
            return true;
        });

        chrome.storage.local.set({ oldElementSelectors });
    };

    /**
     * Tells the popup to update the interface.
     */
    self.updateInterface = () => {
        chrome.runtime.sendMessage({
            command: 'updateInterface',
            args: {}
        });
    };

    /**
     * Updates the status for all controls.
     */
    self.updateControls = () => {
        Object.entries(self.controls).every(([controlId, control]) => {
            if (control.state.status === 'detected'
                    || control.state.status === 'not-detected') {
                return true;
            }

            let controlStatusLevel = 0;
            control.dependencies.every((elementId) => {
                let element = self.elements[elementId];
                if (element === undefined) {
                    console.log(`ERROR: Element ${elementId} does not exist.`);
                    controlStatusLevel = 3;
                    return false;
                }

                controlStatusLevel = Math.max({
                    'detected': 0,
                    'searching-with-store': 1,
                    'searching': 2,
                    'not-detected': 3
                }[element.state.status], controlStatusLevel);
                return true;
            });

            control.state.status = [
                'detected',
                'searching-with-store',
                'searching',
                'not-detected'
            ][controlStatusLevel];
            return true;
        });

        self.storeControls();
        self.updateInterface();
    };

    /**
     * Sets the CSS selector for an element after it has been identified.
     * @param {String} elementId - ID of the element to set
     * @param {String} selector - CSS selector value to set
     */
    self.setElementSelector = (elementId, selector) => {
        let element = self.elements[elementId];
        if (element === null) {
            return;
        }

        if (element.state.status === 'detected') {
            return;
        }

        console.log(`DEBUG: setElementSelector: ${elementId} ${element.state.status} -> detected`);
        element.state.status = 'detected';
        element.state.selector = selector;
        self.storeOldElementSelectors();
        self.updateControls();
        self.findElements();
    };

    /**
     * Sets the status of an element to not-detected.
     * @param {String} elementId - ID of the element to set
     */
    self.setElementNotDetected = (elementId) => {
        let element = self.elements[elementId];
        if (element === null) {
            return;
        }

        console.log(`DEBUG: setElementNotDetected: ${elementId} ${element.state.status} -> not-detected`);
        element.state.status = 'not-detected';
        self.updateControls();
    };

    /**
     * Finds an element on a page.
     * @param elementId - ID of the element to find
     * @param xpath - xpath to find the element with
     * @param contextSelector - CSS selector for the element to use as the
     *                          context for the xpath
     */
    self.page.findElement = (elementId, xpath, contextSelector) => {
        if (typeof fbgeSearchRecord === 'undefined') {
            var fbgeSearchRecord = new Set();
        } else if (fbgeSearchRecord.has(elementId)) {
            return;
        }

        fbgeSearchRecord.add(elementId);
        let finder = (elementId, xpath, contextSelector, attempt) => {
            let contextElements = []
            if (contextSelector === null) {
                contextElements = [document];
            } else {
                contextElements = Array.from(
                    document.querySelectorAll(contextSelector));
            }

            let element = null;
            contextElements.every((contextElement) => {
                element = document.evaluate(
                    xpath,
                    contextElement,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null).singleNodeValue;

                return element === null;
            });

            if (element === null) {
                if (attempt > 49) {
                    // give up after 50 attempts
                    chrome.runtime.sendMessage({
                        command: 'setElementNotDetected',
                        args: { elementId }
                    });

                    return;
                }

                attempt += 1;
                setTimeout(
                    finder.bind({}, elementId, xpath, contextSelector, attempt),
                    Math.min(attempt * 1000, 10000));

                return;
            }

            let selector = (
                element.tagName.toLowerCase()
                + [''].concat(Array.from(element.classList)).join('.')
            );

            chrome.runtime.sendMessage({
                command: 'setElementSelector',
                args: { elementId, selector }
            });
        };

        finder(elementId, xpath, contextSelector, 0);
    };

    /**
     * Executes the findElement function on the current page for each element
     * whose context has been identified.
     */
    self.findElements = () => {
        chrome.windows.getCurrent((win) => {
            chrome.tabs.query({
                active: true,
                windowId: win.id
            }).then((tabs) => {
                if (!tabs.length) {
                    return;
                }

                if (!tabs[0].url.startsWith('https://www.facebook.com/')) {
                    return;
                }

                Object.entries(self.elements).every(([elementId, element]) => {
                    if (element.state.status === 'detected'
                        || element.state.status === 'not-detected') {
                        return true;
                    }

                    let context = null;
                    let contextElementId = element.search.context;
                    if (contextElementId !== undefined) {
                        let contextElement = self.elements[contextElementId];
                        if (contextElement === undefined) {
                            console.log(`ERROR: Element ${elementId} does not exist.`);
                            return true;
                        }

                        context = contextElement.state.selector;
                        if (context === null) {
                            return true;
                        }
                    }

                    chrome.scripting.executeScript({
                        target: {
                            tabId: tabs[0].id
                        },
                        function: self.page.findElement,
                        args: [elementId, element.search.xpath, context]
                    });

                    return true;
                });
            });
        });
    };

    /**
     * Populates the contents of the embedded stylesheet on the page.
     */
    self.page.setStyles = () => {
        // get style element
        let stylesheet = document.getElementById('fbgesStylesheet');
        if (stylesheet === null) {
            stylesheet = document.createElement('style');
            stylesheet.setAttribute('id', 'fbgesStylesheet');
            document.head.appendChild(stylesheet);
        }

        // update styles
        chrome.storage.local.get(['styles'], ({ styles }) => {
            stylesheet.textContent = styles;
        });
    };

    /**
     * Generates a new embedded stylesheet for the page.
     */
    self.updateStyles = () => {
        // generate stylesheet
        let styles = '/* generated by the Facebook Gaming Enhancement Suite */';
        Object.entries(self.controls).every(([controlId, control]) => {
            if (control.state.enabled && control.state.selected !== null) {
                let style = control.generateStyles(
                    control.state.selected);

                if (style !== undefined) {
                    styles += `
/* ${controlId} */
${style.trim()}
`;
                }
            }

            return true;
        });

        // store stylesheet
        chrome.storage.local.set({ styles });

        // update the stylesheet on the page
        chrome.windows.getCurrent((win) => {
            chrome.tabs.query({
                active: true,
                windowId: win.id
            }).then((tabs) => {
                if (!tabs.length) {
                    return;
                }

                if (!tabs[0].url.startsWith('https://www.facebook.com/')) {
                    return;
                }

                chrome.scripting.executeScript({
                    target: {
                        tabId: tabs[0].id
                    },
                    function: self.page.setStyles
                });
            });
        });
    };

    /**
     * Sets state values for a control.
     * @param {String} controlId - ID of the control to set
     * @param {Object} state - state values to set
     */
     self.setControlState = (controlId, state) => {
        let control = self.controls[controlId];
        if (control === undefined) {
            console.log(`ERROR: Control ${controlId} does not exist.`);
            return;
        }

        Object.entries(state).every(([key, value]) => {
            control.state[key] = value;
        });

        self.storeControls();
        self.storeOldControlStates();
        self.updateStyles();
    };

    /**
     * Resets controls and elements for the extension and restarts the element
     * search logic.
     */
    self.reset = () => {
        Object.entries(self.elements).every(([elementId, element]) => {
            console.log(`DEBUG: reset: ${elementId} ${element.state.status} -> searching`);
            element.state = {
                status: 'searching',
                selector: null
            };

            return true;
        });

        Object.entries(self.controls).every(([controlId, control]) => {
            control.state = {
                status: 'searching',
                enabled: false,
                selected: null
            };

            return true;
        });

        self.storeControls();
        self.storeOldControlStates();
        self.storeOldElementSelectors();
        self.updateInterface();
        self.updateStyles();
        self.findElements();
    };

    /**
     * Handles messages from the page and popup.
     */
    self.handleMessage = (request, sender, respond) => {
        let response = undefined;
        if (request.command === 'setElementSelector') {
            self.setElementSelector(
                request.args.elementId,
                request.args.selector);
        } else if (request.command === 'setElementNotDetected') {
            self.setElementNotDetected(
                request.args.elementId);
        } else if (request.command === 'setControlState') {
            self.setControlState(
                request.args.controlId,
                request.args.state);
        } else if (request.command === 'reset') {
            self.reset();
        }

        if (response !== undefined) {
            respond(response);
        }
    };

    /**
     * Initializes the extension. This should only be called once, as soon as
     * the extension is started.
     */
    self.main = () => {
        // setup listener for handling messages
        chrome.runtime.onMessage.addListener(self.handleMessage);

        // store initial controls
        self.storeControls();

        // get information from storage
        chrome.storage.sync.get(['oldElementSelectors', 'oldControlStates'], (oldElementSelectors, oldControlStates) => {
            if (oldElementSelectors !== undefined) {
                Object.entries(oldElementSelectors).every(([elementId, selector]) => {
                    let element = self.elements[elementId];
                    if (element == undefined) {
                        return true;
                    }

                    if (element.state.status === 'searching') {
                        console.log(`DEBUG: main: ${elementId} searching -> searching-with-store`);
                        element.state.status = 'searching-with-store';
                        element.state.selector = selector;
                    }

                    return true;
                });
            }

            if (oldControlStates !== undefined) {
                Object.entries(oldControlStates).every(([controlId, state]) => {
                    let control = self.controls[controlId];
                    if (control === undefined) {
                        console.log(`ERROR: Control ${controlId} does not exist.`);
                        return true;
                    }

                    if (control.state.status === 'searching') {
                        control.state.enabled = state.enabled;
                        control.state.selected = state.selected;
                    }

                    return true;
                });
            }

            self.updateControls();
        });

        // update styles and find elements on page load
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete'
                    && tab.url.startsWith('https://www.facebook.com/')) {
                self.updateStyles();
                self.findElements();
            }
        });

        // update styles and find elements on tab switch
        chrome.tabs.onActivated.addListener((activeInfo) => {
            self.updateStyles();
            self.findElements();
        });
    };

    return self;
})();

BACKGROUND.main();
