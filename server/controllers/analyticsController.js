import Visitor from "../models/Visitor.js";

const getDeviceType = (userAgent = "") => {
  const ua = userAgent.toLowerCase();

  if (/ipad|tablet|playbook|silk/.test(ua)) {
    return "tablet";
  }

  if (
    /mobile|iphone|ipod|android|blackberry|windows phone|opera mini/.test(
      ua
    )
  ) {
    return "mobile";
  }

  if (ua) {
    return "desktop";
  }

  return "unknown";
};

/*
|--------------------------------------------------------------------------
| Track Website Visit
|--------------------------------------------------------------------------
*/

export const trackVisit = async (req, res) => {
  try {
    const { visitorId, sessionId, page, referrer } = req.body;

    if (!visitorId || !sessionId) {
      return res.status(400).json({
        success: false,
        message: "visitorId and sessionId are required",
      });
    }

    const cleanPage =
      typeof page === "string" && page.trim()
        ? page.trim().slice(0, 500)
        : "/";

    /*
     * Prevent duplicate tracking of the exact same
     * visitor/session/page within a short period.
     *
     * This protects against accidental duplicate requests.
     */
    const tenSecondsAgo = new Date(Date.now() - 10 * 1000);

    const existingVisit = await Visitor.findOne({
      visitorId,
      sessionId,
      page: cleanPage,
      createdAt: { $gte: tenSecondsAgo },
    });

    if (existingVisit) {
      return res.status(200).json({
        success: true,
        message: "Visit already tracked",
      });
    }

    const userAgent = req.headers["user-agent"] || "";

    const visit = await Visitor.create({
      visitorId,
      sessionId,
      page: cleanPage,
      referrer:
        typeof referrer === "string" ? referrer.slice(0, 1000) : "",
      userAgent,
      device: getDeviceType(userAgent),
      user: req.user?._id || null,
    });

    return res.status(201).json({
      success: true,
      visitId: visit._id,
    });
  } catch (error) {
    console.error("❌ Track Visit Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to track visit",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Admin Visitor Analytics
|--------------------------------------------------------------------------
*/

export const getVisitorAnalytics = async (req, res) => {
  try {
    const { range = "7d" } = req.query;

    const now = new Date();

    let startDate;

    switch (range) {
      case "today": {
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
      }

      case "yesterday": {
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      }

      case "7d": {
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        break;
      }

      case "30d": {
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 29);
        startDate.setHours(0, 0, 0, 0);
        break;
      }

      case "thisMonth": {
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        );
        break;
      }

      case "lastMonth": {
        startDate = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        );
        break;
      }

      default: {
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
      }
    }

    /*
     * MongoDB's $dateToString supports timezone.
     * HoneyTerra analytics are displayed according to IST.
     */
    const timezone = "Asia/Kolkata";

    const totalVisits = await Visitor.countDocuments({
      createdAt: {
        $gte: startDate,
      },
    });

    const uniqueVisitorsResult = await Visitor.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
          },
        },
      },
      {
        $group: {
          _id: "$visitorId",
        },
      },
      {
        $count: "total",
      },
    ]);

    const uniqueVisitors =
      uniqueVisitorsResult.length > 0
        ? uniqueVisitorsResult[0].total
        : 0;

    /*
     * Daily statistics
     */
    const dailyStats = await Visitor.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
          },
        },
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone,
            },
          },

          totalVisits: {
            $sum: 1,
          },

          uniqueVisitors: {
            $addToSet: "$visitorId",
          },
        },
      },

      {
        $project: {
          _id: 0,
          date: "$_id",
          totalVisits: 1,
          uniqueVisitors: {
            $size: "$uniqueVisitors",
          },
        },
      },

      {
        $sort: {
          date: 1,
        },
      },
    ]);

    /*
     * Device statistics
     */
    const deviceStats = await Visitor.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
          },
        },
      },

      {
        $group: {
          _id: "$device",
          count: {
            $sum: 1,
          },
        },
      },

      {
        $project: {
          _id: 0,
          device: "$_id",
          count: 1,
        },
      },

      {
        $sort: {
          count: -1,
        },
      },
    ]);

    /*
     * Page statistics
     */
    const pageStats = await Visitor.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
          },
        },
      },

      {
        $group: {
          _id: "$page",
          visits: {
            $sum: 1,
          },
        },
      },

      {
        $project: {
          _id: 0,
          page: "$_id",
          visits: 1,
        },
      },

      {
        $sort: {
          visits: -1,
        },
      },

      {
        $limit: 10,
      },
    ]);

    return res.status(200).json({
      success: true,

      range,

      summary: {
        totalVisits,
        uniqueVisitors,
      },

      dailyStats,

      deviceStats,

      pageStats,
    });
  } catch (error) {
    console.error("❌ Visitor Analytics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch visitor analytics",
    });
  }
};