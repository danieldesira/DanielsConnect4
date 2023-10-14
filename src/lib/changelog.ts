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
            }
        ]
    });
}