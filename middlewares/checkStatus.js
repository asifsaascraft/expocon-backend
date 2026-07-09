const checkStatus = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized.",
    });
  }

  if (req.user.status !== "active") {
    return res.status(403).json({
      success: false,
      message: `Your account is ${req.user.status}.`,
    });
  }

  next();
};

export default checkStatus;