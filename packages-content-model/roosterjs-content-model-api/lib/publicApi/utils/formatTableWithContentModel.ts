import { ensureFocusableParagraphForTable } from '../../modelApi/table/ensureFocusableParagraphForTable';
import {
    createSelectionMarker,
    hasMetadata,
    setParagraphNotImplicit,
} from 'roosterjs-content-model-dom';
import {
    hasSelectionInBlock,
    applyTableFormat,
    getFirstSelectedTable,
    normalizeTable,
    setSelection,
} from 'roosterjs-content-model-core';
import type {
    ContentModelTable,
    IStandaloneEditor,
    TableSelection,
} from 'roosterjs-content-model-types';

/**
 * Invoke a callback to format the selected table using Content Model
 * @param editor The editor object
 * @param apiName Name of API this calling this function. This is mostly for logging.
 * @param callback The callback to format the table. It will be called with current selected table. If no table is selected, it will not be called.
 * @param selectionOverride Override the current selection. If we want to format a table even currently it is not selected, we can use this parameter to override current selection
 */
export function formatTableWithContentModel(
    editor: IStandaloneEditor,
    apiName: string,
    callback: (tableModel: ContentModelTable) => void,
    selectionOverride?: TableSelection
) {
    editor.formatContentModel(
        model => {
            const [tableModel, path] = getFirstSelectedTable(model);

            if (tableModel) {
                callback(tableModel);

                if (!hasSelectionInBlock(tableModel)) {
                    const paragraph = ensureFocusableParagraphForTable(model, path, tableModel);

                    if (paragraph) {
                        const marker = createSelectionMarker(model.format);

                        paragraph.segments.unshift(marker);
                        setParagraphNotImplicit(paragraph);
                        setSelection(model, marker);
                    }
                }

                normalizeTable(tableModel, model.format);

                if (hasMetadata(tableModel)) {
                    applyTableFormat(tableModel, undefined /*newFormat*/, true /*keepCellShade*/);
                }

                return true;
            } else {
                return false;
            }
        },
        {
            apiName,
            selectionOverride,
        }
    );
}
