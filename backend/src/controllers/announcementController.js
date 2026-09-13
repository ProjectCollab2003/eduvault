import { announcementRepository } from "../repositories/announcementRepository.js";

export const announcementController = {
  async getAnnouncements(req, res, next) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const offset = req.query.offset ? Number(req.query.offset) : 0;
      const announcements = await announcementRepository.findAll({ limit, offset });

      res.status(200).json({
        success: true,
        data: announcements,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAnnouncementById(req, res, next) {
    try {
      const { id } = req.params;
      const announcement = await announcementRepository.findById(Number(id));

      if (!announcement) {
        return res.status(404).json({
          success: false,
          message: "Announcement not found.",
        });
      }

      res.status(200).json({
        success: true,
        data: announcement,
      });
    } catch (error) {
      next(error);
    }
  },
};
