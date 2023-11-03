import Dialog from "../dialog/dialog";
import { DialogIds } from "../enums/dialog-ids";

export default function openChangelog() {
    Dialog.changelog({
        id: DialogIds.Changelog,
        title: 'Daniel`s Connect4 Version History',
        releases: [
            {
                version: '0.3.8',
                status: 'Beta',
                dateTime: '',
                points: [
                    {
                        text: 'Internal:',
                        subPoints: [
                            'Load game title and version number from config',
                            'General code cleanup and refactoring',
                            'Introduced Tailwind for more compact CSS by reusing pre-existing classes',
                        ]
                    },
                    {
                        text: 'UI:',
                        subPoints: [
                            'Apply progress cursor until user info request completes',
                            'Smaller exit button and reduced the gap between menu buttons'
                        ]
                    }
                ]
            },
            {
                version: '0.3.7',
                status: 'Beta',
                dateTime: '19/10/2023 10:15AM Malta time',
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
                            'Changelog dialog',
                            '"text" made an optional parameter'
                        ]
                    },
                    {
                        text: 'Opted for official Google signon button in attempt to solve issue with iOS'
                    }
                ]
            },
            {
                version: '0.3.6.1',
                status: 'Beta',
                dateTime: '08/10/2023 0:30AM Malta time',
                points: [
                    { text: 'Applied quick fix for credits and changelog pages in dark mode' },
                    { text: 'Changed dialog text color to white' }
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
                        text: 'Multiple dimensions'
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
                        text: 'Logout if Google token is no longer valid'
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
                        text: 'Internal: Cleanup localStorage management'
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
                        text: 'Introduced Google signon button which is now required for network play'
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
                        text: 'Credits link turned black'
                    },
                    {
                        text: 'Error messages for Share icon'
                    },
                    {
                        text: 'Updated game instructions and fixed the random line breaks'
                    }
                ]
            },
            {
                version: '0.3.1',
                status: 'Beta',
                dateTime: '22/07/2023',
                points: [
                    { text: 'Github icon points to my Github profile' },
                    { text: 'Email icon subject set to "Connect4"' },
                    { text: 'Added links to my official Instagram and Facebook pages' },
                    { text: 'Added Share button' },
                    { text: 'Change cursor to `progress` while waiting for opponent' },
                    { text: 'Introduced keyboard shortcuts during game play' }
                ]
            },
            {
                version: '0.3',
                status: 'Beta',
                dateTime: '18/07/2023',
                points: [
                    {
                        text: 'Minor UI changes:',
                        subPoints: [
                            'Improved board spacing',
                            'Empty spots are now light yellow',
                            'Menu style and text changes',
                            'Changed font to Source-Sans-Pro',
                            'Neater top section',
                            'Report bugs links',
                            'Fixed bug(#30) where last row was not being displayed on smaller screen resolutions',
                            'Hovering over buttons turns cursor into pointer',
                        ]
                    },
                    {
                        text: 'Introduced custom dialogs'
                    },
                    {
                        text: 'Player name inputs:',
                        subPoints: [
                            'Validation preventing blank player names',
                            'Player names restricted to 10 characters'
                        ]
                    },
                    {
                        text: 'Internal:',
                        subPoints: [
                            'Refactoring and code cleanup',
                            'Set up "npm start" script'
                        ]
                    },
                    {
                        text: 'First turn (red/green) selected by random'
                    },
                    {
                        text: 'Network mode:',
                        subPoints: [
                            'Exit game in case of connection error',
                            'Winner is now determined by server',
                            'Disabled timer',
                            'Removed logic to stop game in case of inactivity',
                            '"Skip turn" is now handled by the server'
                        ]
                    }
                ]
            },
            {
                version: '0.2.1',
                status: 'Alpha',
                dateTime: '27/03/2023',
                points: [
                    { text: 'Network mode: Attempt to reconnect after connection is closed' },
                    { text: 'Network mode: Cleanup events when connection is closed manually' },
                    { text: 'Further refactoring into smaller modules' },
                    { text: 'Current turn player is now underlined and italicised' },
                    { text: 'Network mode: Inactivity countdown system' }
                ]
            },
            {
                version: '0.2',
                status: 'Alpha',
                dateTime: '14/02/2023',
                points: [
                    { text: 'Added credits page' },
                    { text: 'Noscript notice' },
                    { text: 'Minor fix: Removed vertical scrollbar when first visiting main menu' },
                    { text: 'Minor code cleanup: Printing coin colors simplified due to string enum as well as some other refactoring' },
                    { text: 'Network play' },
                    { text: 'Full board detection' },
                    { text: 'Sound effects for wins, loses and coin drops' },
                    { text: 'UI: Board space distributed more evenly' }
                ]
            },
            {
                version: '0.1.3.1',
                status: 'Alpha',
                dateTime: '16/01/2023',
                points: [{text: 'Continue UI changes to make it look better as well as improve experience on mobile devices'}]
            },
            {
                version: '0.1.3',
                status: 'Alpha',
                dateTime: '15/01/2023',
                points: [
                    { text: 'Internal: Configured Webpack to produce a single minified file and sourcemap' },
                    { text: 'Minor UI changes: Blue background for player names and version number as link to release notes' },
                    { text: 'Fix: Coin responds to moves inline with respective column' },
                    { text: 'Improvement: Timer paused when browser tab is inactive' },
                    { text: 'Improvement: Dynamic canvas resizing' }
                ]
            },
            {
                version: '0.1.2',
                status: 'Alpha',
                dateTime: '10/01/2023',
                points: [
                    { text: 'Internal: eliminated inline styles' },
                    { text: 'Bug fix: Hidden Exit button when game ends' },
                    { text: 'Implement timer on top' },
                    { text: 'Heading placed inline' },
                    { text: 'Print names for Green and Red players on the top' }
                ]
            },
            {
                version: '0.1.1',
                status: 'Alpha',
                dateTime: '09/01/2023',
                points: [
                    { text: 'Internal code adjustment (issue 1) - Adjusted board array to read board[col][row]' },
                    { text: 'Styled main menu and introduced release notes link' },
                    { text: 'Ported save game state feature from the other implementation (cleaner and also saves when closing the page!)' }
                ]
            },
            {
                version: '0.1',
                status: 'Alpha',
                dateTime: '06/01/2023',
                points: [
                    { text: 'Port from old version adapted to TypeScript syntax and some refactoring (excluding a few features)' },
                    { text: 'Fixed bug - clearing marker above the board as mouse moves' },
                    { text: 'New - Prompts for names for Red and Green players' }
                ]
            }
        ]
    });
}