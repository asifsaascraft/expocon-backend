import authPaths from "./auth.swagger.js";
import userPaths from "./user.swagger.js";
import companyTypePaths from "./companyType.swagger.js";
import monthPaths from "./month.swagger.js";
import statePaths from "./state.swagger.js";
import associationTypePaths from "./associationType.swagger.js";
import eventTypePaths from "./eventType.swagger.js";
import exhibitionTypePaths from "./exhibitionType.swagger.js";
import entryTypePaths from "./entryType.swagger.js";
import conferenceTypePaths from "./conferenceType.swagger.js";
// import partnerPaths from "./partner.swagger.js";
// import staffPaths from "./staff.swagger.js";

const paths = {
  ...authPaths,
  ...userPaths,
  ...companyTypePaths,
  ...monthPaths,
  ...statePaths,
  ...associationTypePaths,
  ...eventTypePaths,
  ...exhibitionTypePaths,
  ...entryTypePaths,
  ...conferenceTypePaths,
};

export default paths;
