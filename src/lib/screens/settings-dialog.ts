import { BoardDimensions, Themes } from "@danieldesira/daniels-connect4-common";
import Authentication from "../authentication";
import Dialog from "../dialog/dialog";
import dimensionsSelect from "../dimensions-select";
import { DialogIds } from "../enums/dialog-ids";
import Utils from "../utils";
import applySelectedTheme from "../theme";

export default async function openSettings() {
    Utils.enableProgressCursor();
    dimensionsSelect.onChange = null;
    const settings = await Authentication.getSettings();
    Utils.disableProgressCursor();
    dimensionsSelect.default = settings.dimensions;
    Dialog.prompt({
        id: DialogIds.Settings,
        title: 'Settings',
        text: [],
        inputs: [],
        selects: [
            dimensionsSelect,
            {
                name: 'theme',
                label: 'Theme',
                required: true,
                options: [
                    {
                        text: 'Light',
                        value: Themes.Light.toString()
                    },
                    {
                        text: 'Dark',
                        value: Themes.Dark.toString()
                    },
                    {
                        text: 'System',
                        value: Themes.System.toString()
                    }
                ],
                default: settings.theme,
                onChange: () => {}
            }
        ],
        onOK: async () => {
            const dimensionsSelect = document.getElementById('dialog-select-dimensions') as HTMLSelectElement;
            const dimensions = parseInt(dimensionsSelect.value) as BoardDimensions;
            const themeSelect = document.getElementById('dialog-select-theme') as HTMLSelectElement;
            const theme = parseInt(themeSelect.value) as Themes;
            Utils.enableProgressCursor();
            await Authentication.updateSettings({
                dimensions,
                theme
            });
            Utils.disableProgressCursor();
            await applySelectedTheme();
        },
        onCancel: null
    });
}