import SvgIcon from '@mui/material/SvgIcon';

const EditIcon = (props) => {
    const { stroke = "#535862", size = 20, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox={`0 0 20 21`}
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M14.1667 3.41356C14.3856 3.19469 14.6454 3.02107 14.9314 2.90262C15.2173 2.78417 15.5238 2.72321 15.8334 2.72321C16.1429 2.72321 16.4494 2.78417 16.7353 2.90262C17.0213 3.02107 17.2812 3.19469 17.5 3.41356C17.7189 3.63243 17.8925 3.89227 18.011 4.17823C18.1294 4.4642 18.1904 4.7707 18.1904 5.08023C18.1904 5.38976 18.1294 5.69625 18.011 5.98222C17.8925 6.26819 17.7189 6.52802 17.5 6.74689L6.25002 17.9969L1.66669 19.2469L2.91669 14.6636L14.1667 3.41356Z" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default EditIcon;
