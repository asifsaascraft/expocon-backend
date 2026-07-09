import authPaths from "./auth.swagger.js";
import userPaths from "./user.swagger.js";
// import partnerPaths from "./partner.swagger.js";
// import staffPaths from "./staff.swagger.js";

const paths = {
  ...authPaths,
  ...userPaths,
};

export default paths;