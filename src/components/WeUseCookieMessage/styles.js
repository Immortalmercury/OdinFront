import { makeStyles } from "@material-ui/styles";

export default makeStyles(() => ({
  wrap: {
    position: 'absolute',
    right: 'calc(100vw - 50% - 300px)',
    bottom: 10,
    width: 600,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: "#BABABA",
    padding: 20,
    borderRadius: 10
  },
  close: {
    position: 'absolute',
    right: 5,
    top: 5,
    color: '#AAAAAA',
    
  },
  message: {
    
  },
  messageLink: {
    color:'#AAAAAA'
  }
}));
