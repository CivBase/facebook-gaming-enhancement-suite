let POPUP = (function() {
    let self = {};

    // stores local state values for controls
    self.controls = {};

    // defines the organization of controls in the interface
    self.controlsLayout = [{
        category: 'Overlay',
        controls: [
            'overlayStatusSize',
            'overlayOpacity'
        ]
    }, {
        category: 'Chat',
        controls: [
            'chatPanel',
            'chatHeader',
            'chatPinned',
            'chatEmojiStreamOpacity'
        ]
    }, {
        category: 'Comment',
        controls: [
            'commentAvatarSize',
            'commentAvatarShape',
            'commentStickerSize',
            'commentMargins',
            'commentPadding',
            'commentNameColor',
            'commentAtOnMentions',
            'commentMentionColor',
            'commentReactions'
        ],
    }, {
        category: 'Comment Links',
        controls: [
            'commentLinksLike',
            'commentLinksTimestamp',
            'commentLinksLocation',
            'commentLinksOpacity'
        ]
    }];

    /**
     * Sets state values for a control.
     * @param {String} controlId - ID of the control to set
     * @param {Object} state - state values to set
     */
    self.setControlState = (controlId, state) => {
        let control = self.controls[controlId];
        if (control !== undefined) {
            Object.entries(state).every(([key, value]) => {
                control.state[key] = value;
            });
        }

        chrome.runtime.sendMessage({
            command: 'setControlState',
            args: { controlId, state }
        });
    };

    /**
     * Creates the interface elements for the controls. This should only be
     * executed once when the popup pages is created.
     */
    self.setupInterface = () => {
        chrome.storage.local.get(['controls'], ({ controls }) => {
            if (controls === undefined) {
                console.log(`ERROR: Controls not in storage.`);
                return;
            }

            let controlTable = document.getElementById('controlTable');
            self.controlsLayout.every((category) => {
                // category row
                let thead = document.createElement('thead');

                let tr = document.createElement('tr');
                tr.className = 'control-category';

                let th = document.createElement('th');
                th.setAttribute('colspan', '4');
                th.innerText = category.category;

                tr.appendChild(th);
                thead.appendChild(tr);

                // control rows
                let tbody = document.createElement('tbody');
                category.controls.every((controlId) => {
                    let control = controls[controlId];
                    if (control === undefined) {
                        console.log(`ERROR: Control ${controlId} does not exist.`);
                        return true;
                    }

                    let tr = document.createElement('tr');
                    tr.className = 'control';
                    tr.id = controlId;

                    // indicator column
                    let tdIndicator = document.createElement('td');
                    tdIndicator.className = 'control-indicator';

                    let spanSearching = document.createElement('span');
                    spanSearching.className = 'searching';
                    tdIndicator.appendChild(spanSearching);

                    let spanSearchingWithStore = document.createElement('span');
                    spanSearchingWithStore.style.display = 'none';
                    spanSearchingWithStore.className = 'searching-with-store';
                    tdIndicator.appendChild(spanSearchingWithStore);

                    let spanDetected = document.createElement('span');
                    spanDetected.className = 'detected';
                    spanDetected.style.display = 'none';
                    spanDetected.innerText = '\u29BF';
                    tdIndicator.appendChild(spanDetected);

                    let spanNotDetected = document.createElement('span');
                    spanNotDetected.className = 'not-detected';
                    spanNotDetected.style.display = 'none';
                    spanNotDetected.innerText = '\u2298';
                    tdIndicator.appendChild(spanNotDetected);

                    tr.appendChild(tdIndicator);

                    // toggle column
                    let tdToggle = document.createElement('td');
                    tdToggle.className = 'control-toggle';

                    let labelSwitch = document.createElement('label');
                    labelSwitch.className = 'switch';

                    let inputToggle = document.createElement('input');
                    inputToggle.className = 'toggle';
                    inputToggle.setAttribute('type', 'checkbox');
                    inputToggle.setAttribute('disabled', '');
                    inputToggle.addEventListener('change', (event) => {
                        let enabled = event.target.checked;
                        self.setControlState(controlId, { enabled });
                    }, false);

                    labelSwitch.appendChild(inputToggle);

                    let spanSlider = document.createElement('spanSlider');
                    spanSlider.className = 'slider';
                    labelSwitch.appendChild(spanSlider);

                    tdToggle.appendChild(labelSwitch);
                    tr.appendChild(tdToggle);

                    // name column
                    let tdName = document.createElement('td');
                    tdName.className = 'control-name';
                    tdName.innerText = control.name;
                    tr.appendChild(tdName);

                    // select column
                    let tdSelect = document.createElement('td');
                    tdSelect.className = 'control-select';

                    let select = document.createElement('select');
                    select.setAttribute('disabled', '');
                    select.addEventListener('change', (event) => {
                        let selected = event.target.value;
                        if (selected === control.options[0]) {
                            selected = null;
                        }

                        self.setControlState(controlId, { selected });
                    }, false);

                    control.options.every((value) => {
                        let option = document.createElement('option');
                        option.innerText = value;
                        select.appendChild(option);
                        return true;
                    });

                    tdSelect.appendChild(select);
                    tr.appendChild(tdSelect);

                    tbody.appendChild(tr);

                    // setup controls object
                    self.controls[controlId] = {
                        default: control.options[0],
                        state: {
                            status: 'searching',
                            enabled: false,
                            selected: false
                        },
                        elements: {
                            row: tr,
                            indicator: {
                                searching: spanSearching,
                                searchingWithStore: spanSearchingWithStore,
                                detected: spanDetected,
                                notDetected: spanNotDetected
                            },
                            toggle: inputToggle,
                            select: select
                        }
                    };

                    return true;
                });

                controlTable.appendChild(thead);
                controlTable.appendChild(tbody);
                return true;
            });

            self.updateInterface();
        });
    };

    /**
     * Updates the interface elements to reflect the current controls states.
     */
    self.updateInterface = () => {
        chrome.storage.local.get(['controls'], ({ controls }) => {
            if (controls === undefined) {
                console.log(`ERROR: Controls not in storage.`);
                return;
            }

            Object.entries(controls).every(([controlId, control]) => {
                let local = self.controls[controlId];
                if (local === undefined) {
                    console.log(`ERROR: Control ${controlId} does not exist.`);
                    return;
                }

                // update status
                if (local.state.status !== control.state.status) {
                    local.state.status = control.state.status;
                    if (local.state.status === 'searching') {
                        local.elements.indicator.searching.style.removeProperty('display');
                        local.elements.indicator.searchingWithStore.style.display = 'none';
                        local.elements.indicator.detected.style.display = 'none';
                        local.elements.indicator.notDetected.style.display = 'none';
                        local.elements.toggle.setAttribute('disabled', '');
                        local.elements.select.setAttribute('disabled', '');
                    } else if (local.state.status === 'searching-with-store') {
                        local.elements.indicator.searching.style.display = 'none';
                        local.elements.indicator.searchingWithStore.style.removeProperty('display');
                        local.elements.indicator.detected.style.display = 'none';
                        local.elements.indicator.notDetected.style.display = 'none';
                        local.elements.toggle.removeAttribute('disabled');
                        local.elements.select.removeAttribute('disabled');
                    } else if (local.state.status === 'detected') {
                        local.elements.indicator.searching.style.display = 'none';
                        local.elements.indicator.searchingWithStore.style.display = 'none';
                        local.elements.indicator.detected.style.removeProperty('display');
                        local.elements.indicator.notDetected.style.display = 'none';
                        local.elements.toggle.removeAttribute('disabled');
                        local.elements.select.removeAttribute('disabled');
                    } else if (local.state.status === 'not-detected') {
                        local.elements.indicator.searching.style.display = 'none';
                        local.elements.indicator.searchingWithStore.style.display = 'none';
                        local.elements.indicator.detected.style.display = 'none';
                        local.elements.indicator.notDetected.style.removeProperty('display');
                        local.elements.toggle.removeAttribute('disabled');
                        local.elements.select.removeAttribute('disabled');
                    }
                }

                // update enabled
                if (local.state.enabled !== control.state.enabled) {
                    local.state.enabled = control.state.enabled;
                    if (local.state.status === 'searching') {
                        local.elements.toggle.checked = false;
                    } else {
                        local.elements.toggle.checked = control.state.enabled;
                    }
                }

                // update selected
                if (local.state.selected !== control.state.selected) {
                    local.state.selected = control.state.selected;
                    if (local.state.status === 'searching'
                            || control.state.selected === null) {
                        local.elements.select.value = local.default;
                    } else {
                        local.elements.select.value = control.state.selected;
                    }
                }

                return true;
            });
        });
    };

    /**
     * Tells the extension to reset.
     */
    self.reset = () => {
        chrome.runtime.sendMessage({
            command: 'reset',
            args: {}
        });
    };

    /**
     * Handles messages from the extension background.
     */
    self.handleMessage = (request, sender, respond) => {
        let response = undefined;
        if (request.command === 'updateInterface') {
            self.updateInterface();
        }

        if (response !== undefined) {
            respond(response);
        }
    };

    /**
     * Initializes the popup. This should only be called once, as soon as the
     * document has loaded.
     */
    self.main = () => {
        // setup UI for controls
        self.setupInterface();

        // setup listener for handling messages
        chrome.runtime.onMessage.addListener(self.handleMessage);

        let resetLink = document.getElementById('resetLink');
        resetLink.addEventListener('click', (event) => {
            self.reset();
        }, false);

        // show the page
        let content = document.getElementsByClassName('content');
        Array.from(content).every((element) => {
            element.style.removeProperty('display');
            return true;
        });
    };

    return self;
})();

document.addEventListener('DOMContentLoaded', POPUP.main, false);
