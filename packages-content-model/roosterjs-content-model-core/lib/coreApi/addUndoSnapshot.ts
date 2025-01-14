import { createSnapshotSelection } from '../utils/createSnapshotSelection';
import type { AddUndoSnapshot, Snapshot } from 'roosterjs-content-model-types';

/**
 * @internal
 * Add an undo snapshot to current undo snapshot stack
 * @param core The StandaloneEditorCore object
 * @param canUndoByBackspace True if this action can be undone when user press Backspace key (aka Auto Complete).
 * @param entityStates @optional Entity states related to this snapshot.
 * Each entity state will cause an EntityOperation event with operation = EntityOperation.UpdateEntityState
 * when undo/redo to this snapshot
 */
export const addUndoSnapshot: AddUndoSnapshot = (core, canUndoByBackspace, entityStates) => {
    const { lifecycle, contentDiv, undo } = core;
    let snapshot: Snapshot | null = null;

    if (!lifecycle.shadowEditFragment) {
        // Need to create snapshot selection before retrieve innerHTML since HTML can be changed during creating selection when normalize table
        const selection = createSnapshotSelection(core);
        const html = contentDiv.innerHTML;

        snapshot = {
            html,
            entityStates,
            isDarkMode: !!lifecycle.isDarkMode,
            selection,
        };

        undo.snapshotsManager.addSnapshot(snapshot, !!canUndoByBackspace);
        undo.snapshotsManager.hasNewContent = false;
    }

    return snapshot;
};
