import { BoardDimensions } from "@danieldesira/daniels-connect4-common";
import Authentication from "./authentication";
import Dialog from "./dialog/dialog";
import dimensionsSelect from "./dimensions-select";
import { DialogIds } from "./enums/dialog-ids";

export default async function openSettings() {
    dimensionsSelect.onChange = null;
    const settings = await Authentication.getSettings();
    dimensionsSelect.default = settings.dimensions;
    Dialog.prompt({
        id: DialogIds.Settings,
        title: 'Settings',
        text: [],
        inputs: [],
        selects: [dimensionsSelect],
        onOK: async () => {
            const dimensionsSelect = document.getElementById('dialog-select-dimensions') as HTMLSelectElement;
            const dimensions = parseInt(dimensionsSelect.value) as BoardDimensions;
            await Authentication.updateSettings(dimensions);
        },
        onCancel: null
    });
}