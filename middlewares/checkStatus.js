const checkStatus = (...allowedStatus) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (!allowedStatus.includes(req.user.status)) {
      return res.status(403).json({
        success: false,
        message: `Account status is '${req.user.status}'.`,
      });
    }

    next();

  };
};

export default checkStatus;