/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useTheme } from "@emotion/react";
import { Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import { actionMasterCountryCodeList } from "../../store/vendor";
import MyBreadcrumbs from "../../components/breadcrumb";

export default function Dashboard() {
  const theme = useTheme()
  const dispatch = useDispatch()

  /**
   * Initial Render
   */
  useEffect(() => {
    dispatch(actionMasterCountryCodeList())
  }, [])

  return (
    <React.Fragment>
      <Grid container spacing={3} sx={{
        background: theme.palette.common.white, padding: 3, borderRadius: '12px', border: `1px solid ${theme.palette.grey[200]}`
      }} flexDirection={'row'} width={'100%'} mt={3}>
        <MyBreadcrumbs />
      </Grid>
    </React.Fragment>
  );
}
