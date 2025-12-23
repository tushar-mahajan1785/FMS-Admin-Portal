import { Route, Routes } from "react-router-dom";
import AssetTypesChecklist from "./asset-types";
import ChecklistGroups from "./checklist-group";
import ChecklistView from "./view";
import ChecklistSelectAsset from "./select-assets";

export default function TechnicianChecklist() {
    return (
        <Routes>
            <Route index element={<AssetTypesChecklist />} />
            <Route path="checklist-groups/:assetTypeId" element={<ChecklistGroups />} />
            <Route path="checklist-groups/:assetTypeId/view/:groupUuid" element={<ChecklistView />} />
            <Route path="checklist-groups/:assetTypeId/select-assets/:groupUuid" element={<ChecklistSelectAsset />} />
            {/* <Route path="checklist-groups/:assetTypeId/select-assets/:groupUuid/view/:assetId" element={<ChecklistView />} /> */}
        </Routes>
    );
}