import { useLocation } from 'react-router-dom';
import { Box, Breadcrumbs, Stack, useTheme } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { sideMenuItems } from '../../layout/side-menu';
import React from 'react';
import TypographyComponent from '../custom-typography';

export default function MyBreadcrumbs({ child = null }) {
  const location = useLocation();
  const theme = useTheme()

  const breadcrumbNameMap = {};
  let parentMap = {};

  sideMenuItems.forEach(item => {
    if (item.path) {
      breadcrumbNameMap[item.path] = item.title;
    }
    if (item.items) {
      item.items.forEach(subItem => {
        breadcrumbNameMap[subItem.path] = subItem.title;
        // Map the child path to its parent group title
        parentMap[subItem.path] = item.group;
      });
    }
  });

  const pathnames = location.pathname.split('/').filter(x => x);

  //if not path only / return Dashboard
  if (location.pathname === '/') {
    return <Box>
      <TypographyComponent color={theme.palette.text.primary} fontSize={24} fontWeight={500}>
        Dashboard
      </TypographyComponent>
    </Box>
  }

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextIcon fontSize="medium" sx={{ color: theme.palette.grey.primary }} />}
      sx={{ marginBottom: 2 }}
    >
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const name = breadcrumbNameMap[to] || value;
        const last = index === pathnames.length - 1;
        // Handle the last breadcrumb for both nested and top-level items
        if (last) {
          // If the last item has a parent, render both parent and child
          if (parentMap[to]) {
            const parentTitle = parentMap[to];
            return (
              <Box key={to} sx={{ display: 'flex', alignItems: 'center' }}>
                <TypographyComponent color={theme.palette.grey[650]} fontSize={24}>
                  {parentTitle}
                </TypographyComponent>
                {
                  child && child !== null && child.length > 0 ?
                    <React.Fragment>
                      <Stack sx={{ borderLeft: '2px solid', borderColor: theme.palette.grey.primary, height: 25, mx: 1 }}></Stack>
                      <TypographyComponent color={theme.palette.grey[800]} fontSize={24} fontWeight={500}>
                        {name}
                      </TypographyComponent>
                      <Stack sx={{ borderLeft: '2px solid', borderColor: 'text.secondary', height: 25, mx: 1 }}></Stack>
                      <TypographyComponent color={theme.palette.grey.primary} fontSize={24} fontWeight={500}>
                        {child}
                      </TypographyComponent>
                    </React.Fragment>
                    :
                    <React.Fragment>
                      <Stack sx={{ borderLeft: '2px solid', borderColor: 'text.secondary', height: 25, mx: 1 }}></Stack>
                      <TypographyComponent color={theme.palette.grey.primary} fontSize={24} fontWeight={500}>
                        {name}
                      </TypographyComponent>
                    </React.Fragment>
                }

              </Box>
            );
          }

          // If it's a top-level item, just render the single bold title
          return (
            <Box key={to}>
              <TypographyComponent key={to} color={theme.palette.grey.primary} fontSize={24} fontWeight={500}>
                {name && name !== null ? name.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase()) : ''}
              </TypographyComponent>
            </Box>
          );
        }

        // Handle all non-last breadcrumbs
        return (
          <Box key={to}>
            <TypographyComponent key={to} color={breadcrumbNameMap[to] && breadcrumbNameMap[to] !== null ? theme.palette.grey[600] : theme.palette.grey.primary} fontSize={24} fontWeight={500}>
              {name}
            </TypographyComponent>
          </Box>
        );
      })}
    </Breadcrumbs>
  );
};