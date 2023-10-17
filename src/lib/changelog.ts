import Dialog from "./dialog/dialog";
import { DialogIds } from "./enums/dialog-ids";

export default function openChangelog() {
    Dialog.changelog({
        id: DialogIds.Changelog,
        title: 'Daniel`s Connect4 Version History',
        text: [],
        releases: [
            {
                version: '0.3.7',
                status: 'Beta',
                dateTime: '',
                points: [
                    {
                        text: 'Internal:',
                        subPoints: [
                            'Upgraded Common library to 0.2',
                            'Minor code cleanup'
                        ]
                    },
                    {
                        text: 'Dialogs:',
                        subPoints: [
                            'Fixed regression in dialog inputs making text visible again',
                            'Credits as dialog',
                            'Menu dialog replacing the slider',
                            'Adapted button colors for dark mode',
                            'Changelog dialog'
                        ]
                    },
                    {
                        text: 'Opted for official Google signon button in attempt to solve issue with iOS',
                        subPoints: []
                    }
                ]
            },
            {
                version: '0.3.6.1',
                status: 'Beta',
                dateTime: '08/10/2023 0:30AM Malta time',
                points: [
                    {
                        text: 'Applied quick fix for credits and changelog pages in dark mode',
                        subPoints: []
                    },
                    {
                        text: 'Changed dialog text color to white',
                        subPoints: []
                    }
                ]
            },
            {
                version: '0.3.6',
                status: 'Beta',
                dateTime: '07/10/2023 4:30PM Malta time',
                points: [
                    {
                        text: 'Internal:',
                        subPoints: [
                            'Installed Concurrently and combined Webpack and Serve scripts',
                            'Code cleanup'
                        ]
                    },
                    {
                        text: 'UI:',
                        subPoints: [
                            'Changed main menu text color to darkblue',
                            'Moved version number to button of screen',
                            'Smaller menu buttons',
                            'Experimental dark mode support'
                        ]
                    }
                ]
            },
            {
                version: '0.3.5',
                status: 'Beta',
                dateTime: '03/10/2023 5:30PM Malta time',
                points: [
                    {
                        text: 'Multiple dimensions',
                        subPoints: []
                    },
                    {
                        text: 'Internal:',
                        subPoints: [
                            'Code cleanup',
                            'Send token in request header'
                        ]
                    },
                    {
                        text: 'UI:',
                        subPoints: [
                            'Consistent look and feel across browsers and transperant borders for buttons',
                            'Included favicon in changelog and credits pages',
                            'Player stats show in a dialog',
                            'Centered inputs in dialogs',
                            'Timer and countdown placeholders differentiated to prevent programmatic "confusion"'
                        ]
                    },
                    {
                        text: 'Logout if Google token is no longer valid',
                        subPoints: []
                    }
                ]
            },
            {
                version: '0.3.4',
                status: 'Beta',
                dateTime: '05/08/2023 11:00PM Malta time',
                points: [
                    {
                        text: 'Google SSO:',
                        subPoints: [
                            'Solve JS error that at times prevented SSO popup to launch',
                            'Enable logout button in case of WebSocket connection failure',
                            'Retain authentication across page refreshes and browser tabs'
                        ]
                    },
                    {
                        text: 'Internal: Cleanup localStorage management',
                        subPoints: []
                    }
                ]
            },
            {
                version: '0.3.3',
                status: 'Beta',
                dateTime: '05/08/2023',
                points: [
                    {
                        text: '(Responsive) UI:',
                        subPoints: [
                            'Solve zoomed in canvas on Chrome for Android',
                            'Responsive dialog inputs',
                            'Centered dialog titles',
                            'Swapped error div for dialogs',
                            'Added favicon'
                        ]
                    },
                    {
                        text: 'Internal:',
                        subPoints: [
                            'Installed and configured a micro-web server for dev environment',
                            'Removed redundant "build" script',
                            'New "config" file to store environment URLs',
                            'Removed "css-loader" and "style-loader" from dev dependencies'
                        ]
                    },
                    {
                        text: 'Introduced Google signon button which is now required for network play',
                        subPoints: []
                    }
                ]
            },
            {
                version: '0.3.2',
                status: 'Beta',
                dateTime: '23/07/2023',
                points: [
                    {
                        text: 'Dialogs:',
                        subPoints: [
                            'Refactored library to accept only one options parameter for all public methods',
                            'Solved the "form not connected" console warning on Chromium-based browsers',
                            'Added title parameter to options',
                            'Notifications are closed when "Escape" or "Enter" keys are pressed'
                        ]
                    },
                    {
                        text: 'Game controls:',
                        subPoints: [
                            'Fixed minor issue with keybindings: limit was set 10, now taken from "BoardLogic.columns"',
                            'Touchscreen moves to act like mouse moves'
                        ]
                    },
                    {
                        text: 'Credits link turned black',
                        subPoints: []
                    },
                    {
                        text: 'Error messages for Share icon',
                        subPoints: []
                    },
                    {
                        text: 'Updated game instructions and fixed the random line breaks',
                        subPoints: []
                    }
                ]
            }
        ]
    });
}