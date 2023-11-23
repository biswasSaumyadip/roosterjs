import { createContentModelCachePlugin } from './ContentModelCachePlugin';
import { createContentModelCopyPastePlugin } from './ContentModelCopyPastePlugin';
import { createContentModelFormatPlugin } from './ContentModelFormatPlugin';
import { createDOMEventPlugin } from './DOMEventPlugin';
import { createLifecyclePlugin } from './LifecyclePlugin';
import type {
    StandaloneEditorCorePlugins,
    StandaloneEditorOptions,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * Create core plugins for standalone editor
 * @param options Options of editor
 */
export function createStandaloneEditorCorePlugins(
    options: StandaloneEditorOptions,
    contentDiv: HTMLDivElement
): StandaloneEditorCorePlugins {
    return {
        cache: createContentModelCachePlugin(options),
        format: createContentModelFormatPlugin(options),
        copyPaste: createContentModelCopyPastePlugin(options),
        domEvent: createDOMEventPlugin(options, contentDiv),
        lifecycle: createLifecyclePlugin(options, contentDiv),
    };
}