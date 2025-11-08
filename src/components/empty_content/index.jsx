import { Avatar, Stack, useTheme } from "@mui/material";
import parse from 'html-react-parser';
import TypographyComponent from "../custom-typography";

export default function EmptyContent({ imageUrl, title, subTitle, subTitleProps, message, containerProps, imageSize = 300, mt = 10 }) {
  const theme = useTheme()

  return (
    <Stack flexDirection={'column'} alignItems={'center'} mt={mt} rowGap={2} {...containerProps}>
      {
        imageUrl && imageUrl.length > 0 ?
          <Stack>
            <Avatar alt={""} src={imageUrl} sx={{ overFlow: 'hidden', borderRadius: 0, height: imageSize, width: imageSize }} />
          </Stack>
          :
          <></>
      }
      {
        title ?
          <Stack><TypographyComponent fontSize={18} color={theme.palette.action.disabled} >{title}</TypographyComponent></Stack>
          :
          <></>
      }
      {
        message ?
          <Stack><TypographyComponent fontSize={18} color={theme.palette.action.disabled} >{message}</TypographyComponent></Stack>
          :
          <></>
      }
      {
        subTitle ?
          <Stack>
            {
              typeof subTitle === 'string' ?
                <TypographyComponent variant='subtitle2' color={theme.palette.action.disabled} {...subTitleProps}>{parse(subTitle)}</TypographyComponent>
                :
                subTitle
            }
          </Stack>
          :
          <></>
      }

    </Stack>
  )
}
