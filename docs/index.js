import authPaths from "./auth.swagger.js";
import userPaths from "./user.swagger.js";
import companyTypePaths from "./companyType.swagger.js";
import statePaths from "./state.swagger.js";
import associationTypePaths from "./associationType.swagger.js";
import eventTypePaths from "./eventType.swagger.js";
import exhibitionTypePaths from "./exhibitionType.swagger.js";
import entryTypePaths from "./entryType.swagger.js";
// import partnerPaths from "./partner.swagger.js";
// import staffPaths from "./staff.swagger.js";

const paths = {
  ...authPaths,
  ...userPaths,
  ...companyTypePaths,
  ...statePaths,
  ...associationTypePaths,
  ...eventTypePaths,
  ...exhibitionTypePaths,
  ...entryTypePaths,
};

export default paths;
