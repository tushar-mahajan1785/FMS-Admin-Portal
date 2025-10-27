import SvgIcon from '@mui/material/SvgIcon';

const MailIcon = (props) => {
    const { stroke = "#717680", size = 20, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 20 20"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M18.3334 5.0001C18.3334 4.08344 17.5834 3.33344 16.6667 3.33344H3.33335C2.41669 3.33344 1.66669 4.08344 1.66669 5.0001M18.3334 5.0001V15.0001C18.3334 15.9168 17.5834 16.6668 16.6667 16.6668H3.33335C2.41669 16.6668 1.66669 15.9168 1.66669 15.0001V5.0001M18.3334 5.0001L10 10.8334L1.66669 5.0001" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
        </SvgIcon>
    );
};

export default MailIcon;
