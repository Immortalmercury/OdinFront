import React from 'react';

import useStyles from './styles';
import { CircularProgress } from '@material-ui/core';
// import { Backdrop } from '@material-ui/core';

const LoadingPage = ({ style = null}) => {
  var classes = useStyles();
  return (
    <>
      <div className={classes.root} style={style? style:null}>
        <div className={classes.content}>
          {/* <Backdrop className={classes.backdrop} open={true} > */}
            <CircularProgress />
          {/* </Backdrop> */}
        </div>
      </div>
    </>
  );
};

export default LoadingPage;



// export default function SimpleBackdrop() {
//   const classes = useStyles();
//   // const [open, setOpen] = React.useState(false);
//   const handleClose = () => {
//     setOpen(false);
//   };
//   const handleToggle = () => {
//     setOpen(!open);
//   };

//   return (
//     <div>
//       <Button variant="outlined" color="primary" onClick={handleToggle}>
//         Show backdrop
//       </Button>
//       <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
//         <CircularProgress color="inherit" />
//       </Backdrop>
//     </div>
//   );
// }
