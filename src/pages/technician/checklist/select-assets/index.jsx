import { useTheme } from '@emotion/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TechnicianNavbarHeader } from '../../../../components/technician/navbar-header'
import { Box, Button, Divider, Stack } from '@mui/material'
import TypographyComponent from '../../../../components/custom-typography'
import ChevronLeftIcon from '../../../../assets/icons/ChevronLeft'
import QRScanner from '../../../../components/qr-scanner'

export const ChecklistSelectAsset = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const { assetTypeId } = useParams()

    const [screenType, setScreenType] = useState(null)
    const [assetsList, setAssetsList] = useState([])

    useEffect(() => {
        setScreenType('qr-scan')
        setAssetsList([
            {
                id: 1,
                title: "Battery Monitoring system"
            },
            {
                id: 4,
                title: " MBC (Miniature Circuit Breaker)"
            },
            {
                id: 9,
                title: "Electric vehicles (EVs)"
            }
        ])
    }, [])

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>

            {/* HEADER */}
            {screenType === "qr-scan" ? (
                <TechnicianNavbarHeader
                    leftSection={
                        <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
                            <Stack sx={{ cursor: "pointer" }} onClick={() => {
                                navigate(`/checklist/checklist-groups/${assetTypeId}`)
                            }}>
                                <ChevronLeftIcon size={24} />
                            </Stack>
                            <TypographyComponent color={theme.palette.text.primary} fontSize={22} fontWeight={500}>
                                Asset Scan
                            </TypographyComponent>
                        </Stack>
                    }
                />
            ) : (
                <TechnicianNavbarHeader
                    leftSection={
                        <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
                            <Stack sx={{ cursor: "pointer" }} onClick={() => {
                                navigate(`/checklist/checklist-groups/${assetTypeId}`)
                            }}>
                                <ChevronLeftIcon size={24} />
                            </Stack>
                            <TypographyComponent color={theme.palette.text.primary} fontSize={22} fontWeight={500}>
                                Select Asset
                            </TypographyComponent>
                        </Stack>
                    }
                />
            )}

            {/* BODY (Scrollable) */}
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    // p: 1,
                    pb: "10px", // space so content does not hide behind button
                    rowGap: 2
                }}
            >
                {screenType === "qr-scan" ? (
                    <>
                        <Stack sx={{ padding: "16px", borderRadius: "8px", background: theme.palette.common.white, my: 3 }}>
                            <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>
                                Scan QR code and select asset to fill checklist
                            </TypographyComponent>
                        </Stack>

                        <QRScanner />
                    </>
                ) : (
                    <Stack
                        sx={{
                            // height: '500px',
                            overflowY: "auto",
                            borderRadius: "4px",
                            background: theme.palette.common.white,
                            px: "10px", my: 3
                        }}
                    >
                        {assetsList?.map((item, index) => (
                            <Stack
                                key={index}
                                sx={{
                                    py: "16px",
                                    borderBottom: index < assetsList.length - 1 ? `1px solid ${theme.palette.grey[100]}` : 'none',
                                }}
                                onClick={() => {
                                    // navigate(`select-time/${item?.id}`)
                                    navigate(`view/${item?.id}`)
                                }}
                            >
                                <TypographyComponent fontSize={18} fontWeight={500}>
                                    {item?.title}
                                </TypographyComponent>
                            </Stack>
                        ))}
                    </Stack>
                )}
            </Box>

            {/* FIXED BOTTOM BUTTON */}
            <Box
                sx={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    background: theme.palette.grey[50],
                    p: 2,
                    // zIndex: 100,
                    // paddingBottom: 8
                }}
            >
                <Button
                    variant="contained"
                    size='small'
                    sx={{
                        background: theme.palette.primary[600],
                        color: theme.palette.common.white,
                        borderRadius: "10px",
                        py: 1,
                        px: 4,
                        textTransform: "none",
                        fontSize: "16px",
                        fontWeight: 600,
                    }}
                    onClick={() => {
                        setScreenType(screenType === "qr-scan" ? "asset" : "qr-scan");
                    }}
                >
                    {screenType === "qr-scan" ? "Select Asset" : "Scan QR Code"}
                </Button>
            </Box>
        </Box>
    )
}
