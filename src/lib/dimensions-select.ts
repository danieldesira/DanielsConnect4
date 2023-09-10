import { BoardDimensions } from "@danieldesira/daniels-connect4-common";
import { PromptSelect } from "./dialog/prompt-input";

const dimensionsSelectData: PromptSelect = {
    name: 'dimensions',
    label: 'Dimensions',
    required: true,
    options: [
        {
            text: 'Small (6x5)',
            value: BoardDimensions.Small.toString()
        },
        {
            text: 'Medium (7x6)',
            value: BoardDimensions.Medium.toString()
        },
        {
            text: 'Large (9x8)',
            value: BoardDimensions.Large.toString()
        }
    ],
    default: 3,
    onChange: () => {}
};

export default dimensionsSelectData;