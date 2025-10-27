import FilterModal from "../components/filters"

export function filterConfig() {
    let arrData = [
        {
            "name": "vendor_id",
            "label": "Vendor",
            "type": "select",
            "data": [
                {
                    "id": 1,
                    "name": "BPCL"
                }
            ],
            "dataKey": "id",
            "labelKey": "name",
            "value": ""
        },
        {
            "name": "employee",
            "label": "Employee",
            "type": "select",
            "data": [
            ],
            "dependsOn": "vendor_id",
            "apiAction": "actionEmployeeList",
            "apiParams": {
                "vendorId": "vendor_id"
            },
            "dataKey": "",
            "labelKey": "",
            "value": ""
        },
        {
            "name": "asset_model",
            "label": "Asset Model",
            "type": "textfield",
            "value": ""
        },
        {
            "name": "from_date",
            "label": "From Date",
            "type": "date",
            "value": ""
        },
        {
            "name": "to_date",
            "label": "To Date",
            "type": "date",
            "dependsOn": "from_date",
            "value": ""
        }
    ]
    return arrData
}

export default function RenderFilterPopup(filtersPopup, setFiltersPopup, actionAPI) {
    return (
        < FilterModal
            open={filtersPopup}
            onClose={() => setFiltersPopup(false)}
            fieldsArray={filterConfig}
            onApply={() => {
            }}
            apiAction={actionAPI}
        // apiAction={{
        //     actionGetRoleTypeList //object like this should pass the call the api
        // }}
        />
    )
}