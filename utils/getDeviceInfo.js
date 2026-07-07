const getDeviceInfo = (req) => {
  const userAgent = req.headers["user-agent"] || "";

  return {
    deviceId: req.headers["x-device-id"] || null,

    deviceName: req.headers["x-device-name"] || null,

    browser: req.headers["x-browser"] || null,

    operatingSystem: req.headers["x-os"] || null,

    platform: req.headers["x-platform"] || null,

    appVersion: req.headers["x-app-version"] || null,

    ipAddress:
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      req.ip ||
      null,

    userAgent,
  };
};

export default getDeviceInfo;