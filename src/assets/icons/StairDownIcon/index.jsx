import SvgIcon from '@mui/material/SvgIcon';

const StairDownIcon = (props) => {
    const { stroke = "#B54708", size = 24, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 24 24"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M20 20H16V16H12V12H8V8H4" stroke={stroke} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12.4697 4.53033C12.1768 4.23744 12.1768 3.76256 12.4697 3.46967C12.7626 3.17678 13.2374 3.17678 13.5303 3.46967L13 4L12.4697 4.53033ZM20 11H20.75C20.75 11.3033 20.5673 11.5768 20.287 11.6929C20.0068 11.809 19.6842 11.7448 19.4697 11.5303L20 11ZM19.25 7C19.25 6.58579 19.5858 6.25 20 6.25C20.4142 6.25 20.75 6.58579 20.75 7H20H19.25ZM16 11.75C15.5858 11.75 15.25 11.4142 15.25 11C15.25 10.5858 15.5858 10.25 16 10.25V11V11.75ZM20 10.25C20.4142 10.25 20.75 10.5858 20.75 11C20.75 11.4142 20.4142 11.75 20 11.75V11V10.25ZM13 4L13.5303 3.46967L20.5303 10.4697L20 11L19.4697 11.5303L12.4697 4.53033L13 4ZM20 11H19.25V7H20H20.75V11H20ZM16 11V10.25H20V11V11.75H16V11Z"
                fill={stroke} />

        </SvgIcon>
    );
};

export default StairDownIcon;
