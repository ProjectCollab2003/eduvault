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

  async createAnnouncement(req, res, next) {
    try {
      const { title, message, published_at, is_important } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({ success: false, message: "Title is required." });
      }

      if (!message || !message.trim()) {
        return res.status(400).json({ success: false, message: "Message is required." });
      }

      const announcement = await announcementRepository.create({
        admin_id: req.user.user_id,
        title,
        message,
        published_at: published_at ? new Date(published_at) : new Date(),
        is_important: Boolean(is_important),
      });

      res.status(201).json({
        success: true,
        message: "Announcement created successfully.",
        data: announcement,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateAnnouncement(req, res, next) {
    try {
      const { id } = req.params;
      const { title, message, is_important } = req.body;

      const announcement = await announcementRepository.update(Number(id), { title, message, is_important });

      if (!announcement) {
        return res.status(404).json({
          success: false,
          message: "Announcement not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Announcement updated successfully.",
        data: announcement,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteAnnouncement(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await announcementRepository.delete(Number(id));

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Announcement not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Announcement deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  },
};
