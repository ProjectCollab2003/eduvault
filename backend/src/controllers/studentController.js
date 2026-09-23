import { bookmarkRepository } from "../repositories/bookmarkRepository.js";
import { studentRepository } from "../repositories/studentRepository.js";
import { materialRepository } from "../repositories/materialRepository.js";

export const studentController = {
  async dashboard(req, res, next) {
    try {
      res.json({ success: true, data: await studentRepository.getDashboard(req.user.user_id) });
    } catch (error) { next(error); }
  },
  async bookmarks(req, res, next) {
    try {
      res.json({ success: true, data: await studentRepository.getBookmarks(req.user.user_id) });
    } catch (error) { next(error); }
  },
  async addBookmark(req, res, next) {
    try {
      const materialId = Number(req.params.materialId);
      if (!await materialRepository.findById(materialId)) return res.status(404).json({ success: false, message: "Material not found." });
      await bookmarkRepository.add(req.user.user_id, materialId);
      res.status(201).json({ success: true, message: "Bookmark saved." });
    } catch (error) { next(error); }
  },
  async removeBookmark(req, res, next) {
    try {
      await bookmarkRepository.remove(req.user.user_id, Number(req.params.materialId));
      res.json({ success: true, message: "Bookmark removed." });
    } catch (error) { next(error); }
  },
  async addSubjectBookmark(req, res, next) {
    try {
      await studentRepository.addSubjectBookmark(req.user.user_id, Number(req.params.subjectId));
      res.status(201).json({ success: true, message: "Subject bookmark saved." });
    } catch (error) { next(error); }
  },
  async removeSubjectBookmark(req, res, next) {
    try {
      await studentRepository.removeSubjectBookmark(req.user.user_id, Number(req.params.subjectId));
      res.json({ success: true, message: "Subject bookmark removed." });
    } catch (error) { next(error); }
  },
  async recordAccess(req, res, next) {
    try {
      const materialId = Number(req.params.materialId);
      if (!await materialRepository.findById(materialId)) return res.status(404).json({ success: false, message: "Material not found." });
      await studentRepository.recordAccess(req.user.user_id, materialId);
      res.json({ success: true });
    } catch (error) { next(error); }
  },
};
