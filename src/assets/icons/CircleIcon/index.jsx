import SvgIcon from '@mui/material/SvgIcon';

const CircleIcon = (props) => {
    const { stroke = "#535862", size = 16, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 16 16"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M10.9998 6C10.9998 8.76142 8.76118 11 5.99976 11C3.23833 11 0.999756 8.76142 0.999756 6C0.999756 3.23858 3.23833 1 5.99976 1C8.76118 1 10.9998 3.23858 10.9998 6Z" stroke={stroke} strokeWidth="1.04167" />
        </SvgIcon>
    );
};

export default CircleIcon;
