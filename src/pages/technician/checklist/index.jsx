import { Route, Routes } from "react-router-dom";
import { AssetTypesChecklist } from "./asset-types";
import { ChecklistGroups } from "./checklist-group";
import { ChecklistSelectAsset } from "./select-assets";
import { ChecklistSelectTimeSlot } from "./select-time";
import { ChecklistView } from "./view";
// import ChecklistView from "../../checklist/view";

export default function TechnicianChecklist() {
    return (
        <Routes>
            <Route index element={<AssetTypesChecklist />} />
            {/* <Route path="asset-groups/:assetId/view/:groupUuid" element={<ChecklistView />} />*/}
            <Route path="checklist-groups/:assetTypeId" element={<ChecklistGroups />} />
            <Route path="checklist-groups/:assetTypeId/select-assets/:groupUuid" element={<ChecklistSelectAsset />} />
            {/* <Route path="checklist-groups/:assetTypeId/select-assets/:groupUuid/select-time/:assetId" element={<ChecklistSelectTimeSlot />} /> */}
            {/* <Route path="checklist-groups/:assetTypeId/select-assets/:groupUuid/select-time/:assetId/view/:timeUuid" element={<ChecklistView />} /> */}
            <Route path="checklist-groups/:assetTypeId/select-assets/:groupUuid/view/:assetId" element={<ChecklistView />} />
        </Routes>
    );
}