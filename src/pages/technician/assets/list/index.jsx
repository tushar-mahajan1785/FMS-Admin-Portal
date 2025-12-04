import React, { useEffect, useState } from "react";
import MyBreadcrumbs from "../../../../components/breadcrumb";
import { Box, Card, IconButton, Stack, useTheme } from "@mui/material";
import TypographyComponent from "../../../../components/custom-typography";
import ArrowRightIcon from "../../../../assets/icons/ArrowRightIcon";
import BottomNav from "../../../../components/bottom-navbar";

export default function TechnicianAssetList() {
    const theme = useTheme()
    const [getAssetList, setGetAssetList] = useState([])
    // const [value, setValue] = useState(0);

    useEffect(() => {
        setGetAssetList([
            {
                "id": 20,
                "uuid": "h6KmIUE7j5zYcApQgtmWuDGMmZTv4zyY",
                "client_id": 1,
                "client_name": "TATA Power",
                "branch_id": 2,
                "branch_name": "TATA Power Limited Pimpri",
                "asset_id": "ASSET404",
                "asset_description": "Op Asset 4",
                "type": "Operating",
                "sub_type": "sub op",
                "make": "",
                "model": "",
                "rating_capacity": "",
                "serial_no": "",
                "vendor_id": 1,
                "vendor": "VERTIV (HVAC)",
                "manufacturing_date": null,
                "installation_date": null,
                "commissioning_date": null,
                "warranty_start_date": null,
                "warranty_expiry_date": null,
                "amc_start_date": null,
                "amc_expiry_date": null,
                "asset_owner": "Neha P",
                "asset_custodian_id": 13,
                "asset_custodian": "Sakshi Patil",
                "asset_end_life_selection": null,
                "asset_end_life_period": null,
                "location": "Pimpri",
                "additional_fields": [],
                "status": "Active"
            },
            {
                "id": 19,
                "uuid": "KStia0MWK0Q4ofF3z0R5hIFDyQPuXNFX",
                "client_id": 1,
                "client_name": "TATA Power",
                "branch_id": 2,
                "branch_name": "TATA Power Limited Pimpri",
                "asset_id": "ASSET403",
                "asset_description": "Op Asset 3",
                "type": "Operating",
                "sub_type": "sub op",
                "make": "",
                "model": "",
                "rating_capacity": "",
                "serial_no": "",
                "vendor_id": 2,
                "vendor": "PQR Ven",
                "manufacturing_date": null,
                "installation_date": null,
                "commissioning_date": null,
                "warranty_start_date": null,
                "warranty_expiry_date": null,
                "amc_start_date": null,
                "amc_expiry_date": null,
                "asset_owner": "Rhh iuui",
                "asset_custodian_id": 1,
                "asset_custodian": "Akshata Thorat",
                "asset_end_life_selection": null,
                "asset_end_life_period": null,
                "location": "Pune",
                "additional_fields": [],
                "status": "Active"
            },
            {
                "id": 18,
                "uuid": "DdpTlPWoR5kZfAXfsOtbhDfXjXTjwBWs",
                "client_id": 1,
                "client_name": "TATA Power",
                "branch_id": 2,
                "branch_name": "TATA Power Limited Pimpri",
                "asset_id": "ASSET402",
                "asset_description": "Op Asset 2",
                "type": "Operating",
                "sub_type": "sub asset",
                "make": "",
                "model": "",
                "rating_capacity": "",
                "serial_no": "",
                "vendor_id": 3,
                "vendor": "ABC",
                "manufacturing_date": null,
                "installation_date": null,
                "commissioning_date": null,
                "warranty_start_date": null,
                "warranty_expiry_date": null,
                "amc_start_date": null,
                "amc_expiry_date": null,
                "asset_owner": "Gauri Pawar",
                "asset_custodian_id": 2,
                "asset_custodian": "Avinash Suryawanshi",
                "asset_end_life_selection": null,
                "asset_end_life_period": null,
                "location": "Nashik",
                "additional_fields": [],
                "status": "Active"
            },
            {
                "id": 17,
                "uuid": "z4YhqTYgp7hZDtckWoKyAKDhelGmkLIh",
                "client_id": 1,
                "client_name": "TATA Power",
                "branch_id": 2,
                "branch_name": "TATA Power Limited Pimpri",
                "asset_id": "ASSET401",
                "asset_description": "Op Asset 1",
                "type": "Operating",
                "sub_type": "sub Op",
                "make": "",
                "model": "",
                "rating_capacity": "",
                "serial_no": "",
                "vendor_id": 4,
                "vendor": "XYZ",
                "manufacturing_date": null,
                "installation_date": null,
                "commissioning_date": null,
                "warranty_start_date": null,
                "warranty_expiry_date": null,
                "amc_start_date": null,
                "amc_expiry_date": null,
                "asset_owner": "Sakshi Patil",
                "asset_custodian_id": 1,
                "asset_custodian": "Akshata Thorat",
                "asset_end_life_selection": null,
                "asset_end_life_period": null,
                "location": "Pimpri",
                "additional_fields": [],
                "status": "Active"
            },
            {
                "id": 14,
                "uuid": "cyBfoDc3JM3sJaG3DR2FmaruIXM82EXd",
                "client_id": 1,
                "client_name": "TATA Power",
                "branch_id": 2,
                "branch_name": "TATA Power Limited Pimpri",
                "asset_id": "ASSET308",
                "asset_description": "Invertor AS",
                "type": "BMS",
                "sub_type": "small invertor",
                "make": "Luminious",
                "model": "",
                "rating_capacity": "",
                "serial_no": "",
                "vendor_id": 3,
                "vendor": "ABC",
                "manufacturing_date": null,
                "installation_date": null,
                "commissioning_date": null,
                "warranty_start_date": null,
                "warranty_expiry_date": null,
                "amc_start_date": null,
                "amc_expiry_date": null,
                "asset_owner": "Rakesh Patil",
                "asset_custodian_id": 4,
                "asset_custodian": "Bhagyashri Patil",
                "asset_end_life_selection": null,
                "asset_end_life_period": null,
                "location": "Nashik",
                "additional_fields": [],
                "status": "Active"
            },
            {
                "id": 13,
                "uuid": "RCZEPQs1KT0Cnu7xp8SjuAMk1MieIvZA",
                "client_id": 1,
                "client_name": "TATA Power",
                "branch_id": 2,
                "branch_name": "TATA Power Limited Pimpri",
                "asset_id": "ASSET307",
                "asset_description": "Generator DS",
                "type": "BMS",
                "sub_type": "sub generator",
                "make": "Luminious",
                "model": "",
                "rating_capacity": "",
                "serial_no": "",
                "vendor_id": 2,
                "vendor": "PQR Ven",
                "manufacturing_date": null,
                "installation_date": null,
                "commissioning_date": null,
                "warranty_start_date": null,
                "warranty_expiry_date": null,
                "amc_start_date": null,
                "amc_expiry_date": null,
                "asset_owner": "Ram Pawar",
                "asset_custodian_id": 1,
                "asset_custodian": "Akshata Thorat",
                "asset_end_life_selection": null,
                "asset_end_life_period": null,
                "location": "Pimpri",
                "additional_fields": [],
                "status": "Active"
            }
        ])
    }, [])
    return (
        <React.Fragment>
            <MyBreadcrumbs />
            <Stack gap={2} sx={{ background: theme.palette.common.white, padding: 2, borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}` }}>
                {
                    getAssetList && getAssetList !== null && getAssetList.length > 0 ?
                        getAssetList.map((asset, index) => {
                            return (<Stack sx={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', border: `1px solid ${theme.palette.grey[400]}`, borderRadius: '8px', padding: '10px 16px', background: theme.palette.common.white }} key={index}>
                                <Stack>
                                    <TypographyComponent fontSize={18} fontWeight={400}>{asset?.asset_description}</TypographyComponent>
                                </Stack>
                                <Stack>
                                    <IconButton
                                        onClick={() => {
                                            // navigate(`asset-groups/${objAsset?.asset_type_id}`)
                                        }}
                                    >
                                        <ArrowRightIcon />
                                    </IconButton>
                                </Stack>
                            </Stack>)
                        })
                        :
                        <></>
                }
            </Stack>
            {/* <BottomNav value={value} onChange={setValue} /> */}
        </React.Fragment>
    )
}