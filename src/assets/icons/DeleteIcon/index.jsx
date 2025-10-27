import SvgIcon from '@mui/material/SvgIcon';

const DeleteIcon = (props) => {
    const { stroke = "#535862", size = 20, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox={`0 0 20 21`}
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M2.5 5.91356H4.16667M4.16667 5.91356H17.5M4.16667 5.91356V17.5802C4.16667 18.0223 4.34226 18.4462 4.65482 18.7587C4.96738 19.0713 5.39131 19.2469 5.83333 19.2469H14.1667C14.6087 19.2469 15.0326 19.0713 15.3452 18.7587C15.6577 18.4462 15.8333 18.0223 15.8333 17.5802V5.91356H4.16667ZM6.66667 5.91356V4.2469C6.66667 3.80487 6.84226 3.38095 7.15482 3.06839C7.46738 2.75583 7.89131 2.58023 8.33333 2.58023H11.6667C12.1087 2.58023 12.5326 2.75583 12.8452 3.06839C13.1577 3.38095 13.3333 3.80487 13.3333 4.2469V5.91356M8.33333 10.0802V15.0802M11.6667 10.0802V15.0802" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default DeleteIcon;
