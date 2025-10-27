import SvgIcon from '@mui/material/SvgIcon';

const ChevronDownIcon = (props) => {
    const { stroke = "#717680", size = 21, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 21 20"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
          <path d="M5.5 7.50009L10.5 12.5001L15.5 7.50009" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
        </SvgIcon>
    );
};

export default ChevronDownIcon;
