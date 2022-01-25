const logger = () => {
    for (let index = 0; index < arguments.length; index++) {
      const element = arguments[index];
      console.log("====================================");
      console.log(element);
      console.log("====================================");
    }
  };
  
export default logger;
  