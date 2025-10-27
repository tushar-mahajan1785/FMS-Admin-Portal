import { Route, Routes } from "react-router-dom";
import AssetList from "./list";
import AssetBulkUpload from "./bulk-upload";

export default function Asset() {
  return (
    <Routes>
      <Route index element={<AssetList />} />
      <Route path="/bulk-upload" element={<AssetBulkUpload />} />
    </Routes>
  );
}