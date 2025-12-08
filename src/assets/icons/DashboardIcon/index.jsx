import SvgIcon from '@mui/material/SvgIcon';

const DashboardIcon = (props) => {
    const { stroke = "#101828", size = 16, strokeWidth = 1.5, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 16 16"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path
                d="M5.60005 15.2V9.72231C5.60005 9.2181 6.02986 8.80936 6.56005 8.80936H9.44005C9.97024 8.80936 10.4 9.2181 10.4 9.72231V15.2M7.44371 0.968986L1.20371 5.18887C0.950462 5.36013 0.800049 5.63737 0.800049 5.93289V13.8306C0.800049 14.5869 1.44476 15.2 2.24005 15.2H13.76C14.5553 15.2 15.2 14.5869 15.2 13.8306V5.93289C15.2 5.63737 15.0496 5.36013 14.7964 5.18887L8.55639 0.968987C8.22331 0.743737 7.77679 0.743736 7.44371 0.968986Z"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                strokeLinecap="round"
            />
        </SvgIcon>
    );
};

export default DashboardIcon;
