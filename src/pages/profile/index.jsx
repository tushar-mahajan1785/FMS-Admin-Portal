/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
import { Grid, Paper, List, ListItemButton, ListItemText, useTheme, ListItemIcon, Stack } from "@mui/material";
import { useDispatch } from "react-redux";
import RoleTypeIcon from "../../assets/icons/RoleTypeIcon";
import TypographyComponent from "../../components/custom-typography";
import { UserProfileDetails } from "./user-details";
// import { ProfileMyTeam } from "./my-team";
// import ClientsIcon from "../../assets/icons/ClientsIcon";
import SingleUserIcon from "../../assets/icons/SingleUserIcon";
import { useAuth } from "../../hooks/useAuth";
import { actionGetUserProfileDetails, resetGetUserProfileDetailsResponse } from "../../store/common";
import { ProfileMyPermission } from "./my-permission";

export default function Profile() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { user } = useAuth()

  //States
  const [selectedProfileMenu, setSelectedProfileMenu] = useState({
    selected_menu: "My Profile",
    redirect_menu: "My Profile"
  });

  /**
   * Menu Items for left Menu
   */
  const menuItems = [
    { label: "My Profile", icon: <SingleUserIcon size={18} />, can_show: 1 },
    { label: "My Permissions", icon: <RoleTypeIcon size={18} />, can_show: 1 },
    // { label: "My Team", icon: <ClientsIcon size={18} />, can_show: 1 }
  ];

  /**
   * @action : actionGetUserProfileDetails
   * @description : Call My Profile api on branchUuid
   */
  useEffect(() => {
    if (user && user?.employee_id && user?.employee_id !== null) {
      dispatch(actionGetUserProfileDetails({ id: user?.employee_id }))
    }

    return () => {
      dispatch(resetGetUserProfileDetailsResponse())
    }
  }, [user?.user_uuid])

  //Render Content
  const renderContent = useCallback((selectedProfileMenu) => {
    switch (selectedProfileMenu) {
      case "My Profile":
        return <UserProfileDetails />;
      case "My Permissions":
        return <ProfileMyPermission />;
      // case "My Team":
      //   return <ProfileMyTeam />;
      default:
        return (
          <TypographyComponent variant="h6">{selectedProfileMenu}</TypographyComponent>
        );
    }
  }, [selectedProfileMenu])

  return (
    <Grid container spacing={2} alignItems="flex-start">
      {/* Sidebar */}
      <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, px: 1 }}>
        <Paper
          sx={{
            py: { xs: 0, sm: 0 },
            px: 1,
            overflowX: "auto",
            whiteSpace: "nowrap",
            "&::-webkit-scrollbar": { height: 6 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.grey[400],
              borderRadius: 10,
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: theme.palette.grey[600],
            },
          }}
        >
          <Stack flexDirection={'row'} alignItems={'center'}>
            <List
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
                minWidth: "fit-content",
                justifyContent: 'space-around'
              }}
            >
              {menuItems.map((item) =>
                item.can_show === 1 ? (
                  <ListItemButton
                    key={item.label}
                    onClick={() => {
                      let objSelected = {
                        selected_menu: item.label,
                        redirect_menu: item.label
                      }
                      setSelectedProfileMenu(objSelected)
                    }}
                    selected={selectedProfileMenu?.selected_menu === item.label}
                    sx={{
                      borderRadius: 2,
                      py: { xs: 1, sm: 1.5 },
                      px: { xs: 1, sm: 1.5 },
                      flex: "0 0 auto", // prevents shrinking on scroll
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      backgroundColor:
                        selectedProfileMenu?.selected_menu === item.label
                          ? theme.palette.primary[50]
                          : "transparent",
                      "&:hover": {
                        backgroundColor:
                          selectedProfileMenu?.selected_menu === item.label
                            ? theme.palette.primary[100]
                            : theme.palette.grey[50],
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        width: 40,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 1,
                        backgroundColor:
                          selectedProfileMenu?.selected_menu === item.label
                            ? theme.palette.primary[600]
                            : theme.palette.grey[200],
                        color:
                          selectedProfileMenu?.selected_menu === item.label
                            ? "#fff"
                            : theme.palette.grey[500],
                      }}
                    >
                      {React.cloneElement(item.icon, {
                        stroke:
                          selectedProfileMenu?.selected_menu === item.label
                            ? "#fff"
                            : theme.palette.grey[500],
                        color:
                          selectedProfileMenu?.selected_menu === item.label
                            ? "#fff"
                            : theme.palette.grey[500],
                        size: 18,
                      })}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      sx={{
                        typography: "body1",
                        ml: 0.1,
                        whiteSpace: "nowrap",
                      }}
                    />
                  </ListItemButton>
                ) : null
              )}
            </List>
          </Stack>
        </Paper>
      </Grid>
      {/* Main Content */}
      <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
        <Paper sx={{ minHeight: "76vh", p: 2 }}>
          {renderContent(selectedProfileMenu?.redirect_menu)}
        </Paper>
      </Grid>
    </Grid>
  );
}
