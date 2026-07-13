import authPaths from "./auth.swagger.js";
import userPaths from "./user.swagger.js";
import companyTypePaths from "./companyType.swagger.js";
import statePaths from "./state.swagger.js";
import associationTypePaths from "./associationType.swagger.js";
import eventTypePaths from "./eventType.swagger.js";
import exhibitionTypePaths from "./exhibitionType.swagger.js";
import conferenceTypePaths from "./conferenceType.swagger.js";
import jobTypePaths from "./jobType.swagger.js";
import conferenceSegmentPaths from "./conferenceSegment.swagger.js";
import interestedAsPaths from "./interestedAs.swagger.js";
import advertisementLocationPaths from "./advertisementLocation.swagger.js";
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
  ...conferenceTypePaths,
  ...jobTypePaths,
  ...conferenceSegmentPaths,
  ...interestedAsPaths,
  ...advertisementLocationPaths,
};

export default paths;
